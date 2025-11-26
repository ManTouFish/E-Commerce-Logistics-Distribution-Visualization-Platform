import { useState, useEffect } from "react";
import { Table, Tag, Card, Radio, Input, Button, Typography, message, Space } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

// 1. 类型定义：严格对应 SQL 表结构
interface Order {
	id: string;
	order_number: string;
	shop_id: string;
	customer_name: string;
	customer_phone: string;
	customer_address: string;
	total_amount: number;
	status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
	priority: "low" | "normal" | "high" | "urgent";
	estimated_delivery: string | null;
	actual_delivery: string | null;
	created_at: string;
	updated_at: string;
}

// 查询参数状态接口
interface OrderQueryParams {
	page: number;
	pageSize: number;
	status: string; // "ALL" 或 具体状态
	searchText: string; // 用于搜索订单号或客户名
	sortField: string; // 数据库字段名
	sortOrder: "asc" | "desc";
}

const OrderList = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<Order[]>([]);
	const [total, setTotal] = useState(0);

	// 2. 状态管理
	const [queryParams, setQueryParams] = useState<OrderQueryParams>({
		page: 1,
		pageSize: 10,
		status: "ALL",
		searchText: "",
		sortField: "created_at",
		sortOrder: "desc",
	});

	// 3. 核心数据请求逻辑
	const fetchOrders = async () => {
		setLoading(true);
		const { data: { user } } = await supabase.auth.getUser();
    console.log("当前登录用户:", user); 
		try {
			let query = supabase.from("orders").select("*", { count: "exact" });
      console.log(query);
      

			// ... (中间的查询构建逻辑保持不变) ...
			if (queryParams.status !== "ALL") {
				query = query.eq("status", queryParams.status);
			}
			if (queryParams.searchText) {
				const term = queryParams.searchText;
				query = query.or(`order_number.ilike.%${term}%,customer_name.ilike.%${term}%`);
			}
			if (queryParams.sortField) {
				query = query.order(queryParams.sortField, {
					ascending: queryParams.sortOrder === "asc",
				});
			}
			const from = (queryParams.page - 1) * queryParams.pageSize;
			const to = from + queryParams.pageSize - 1;
			query = query.range(from, to);

			const { data: result, error, count } = await query;

			// 如果有 Supabase 错误，抛出它，它会被下面的 catch 捕获
			if (error) throw error;

			setData(result as Order[]);
			setTotal(count || 0);
		} catch (error: unknown) {
			// 2. 这里将 'any' 改为 'unknown'
			console.error("Fetch Error:", error);

			// 3. 类型处理：判断是否为 Supabase 错误或标准 Error
			let errorMessage = "加载订单数据失败";

			// 简单的类型守卫或断言
			if (typeof error === "object" && error !== null && "message" in error) {
				// 将其断言为 PostgrestError 或 Error 对象
				errorMessage = (error as PostgrestError | Error).message;
			}

			message.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// 监听 queryParams 变化自动请求
	useEffect(() => {
		fetchOrders();
	}, [queryParams]);

	// 4. 事件处理函数

	// 处理表格的分页和排序
	const handleTableChange = (
		pagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>,
		sorter: SorterResult<Order> | SorterResult<Order>[]
	) => {
		const sort = Array.isArray(sorter) ? sorter[0] : sorter;

		setQueryParams((prev) => ({
			...prev,
			page: pagination.current || 1,
			pageSize: pagination.pageSize || 10,
			// 确保 sort.field 是字符串 (对应 dataIndex)
			sortField: (sort.field as string) || "created_at",
			sortOrder: sort.order === "ascend" ? "asc" : "desc", // 默认 desc
		}));
	};

	// 处理状态切换
	const handleStatusChange = (e: RadioChangeEvent) => {
		setQueryParams((prev) => ({
			...prev,
			status: e.target.value,
			page: 1, // 切换筛选时重置回第一页
		}));
	};

	// 处理搜索
	const handleSearch = (value: string) => {
		setQueryParams((prev) => ({
			...prev,
			searchText: value,
			page: 1,
		}));
	};

	// 5. 表格列定义
	const columns: ColumnsType<Order> = [
		{
			title: "订单号",
			dataIndex: "order_number",
			key: "order_number",
			render: (text) => <span className="font-mono font-medium text-slate-700">{text}</span>,
		},
		{
			title: "客户信息",
			key: "customer",
			render: (_, record) => (
				<div className="flex flex-col text-sm">
					<span className="font-medium text-slate-800">{record.customer_name}</span>
					<span className="text-xs text-slate-400">{record.customer_phone}</span>
				</div>
			),
		},
		{
			title: "总金额",
			dataIndex: "total_amount",
			key: "total_amount",
			sorter: true, // 开启排序
			align: "right",
			render: (amount) => <span className="font-medium text-slate-700">¥{Number(amount).toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</span>,
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 120,
			render: (status) => {
				// 映射 SQL 中的状态到 UI 颜色和文案
				const statusMap: Record<string, { color: string; text: string }> = {
					pending: { color: "gold", text: "待处理" },
					confirmed: { color: "blue", text: "已确认" },
					shipping: { color: "cyan", text: "配送中" },
					delivered: { color: "green", text: "已送达" },
					cancelled: { color: "default", text: "已取消" },
				};
				const { color, text } = statusMap[status] || { color: "default", text: status };
				return <Tag color={color}>{text}</Tag>;
			},
		},
		{
			title: "下单时间",
			dataIndex: "created_at",
			key: "created_at",
			sorter: true,
			defaultSortOrder: "descend",
			width: 180,
			render: (date) => <span className="text-slate-500">{new Date(date).toLocaleString()}</span>,
		},
		{
			title: "操作",
			key: "action",
			width: 100,
			render: (_, record) => (
				<Button type="link" size="small" onClick={() => message.info(`查看订单 ${record.order_number}`)}>
					详情
				</Button>
			),
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto max-w-7xl space-y-6">
				{/* 顶部标题栏 */}
				<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
					<div>
						<Typography.Title level={3} className="!m-0 text-slate-800">
							订单列表
						</Typography.Title>
						<Typography.Text type="secondary">管理系统中的所有订单记录</Typography.Text>
					</div>
					<Space>
						<Input.Search
							placeholder="搜索订单号或客户名"
							allowClear
							onSearch={handleSearch}
							style={{ width: 260 }}
							enterButton={<Button icon={<SearchOutlined />} type="primary" />}
						/>
						<Button icon={<ReloadOutlined />} onClick={fetchOrders}>
							刷新
						</Button>
					</Space>
				</div>

				{/* 主体内容卡片 */}
				<Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0 }}>
					{/* 状态筛选 Tab */}
					<div className="border-b border-gray-100 px-6 py-4">
						<div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
							<span className="text-sm font-medium text-gray-500 whitespace-nowrap">订单状态:</span>
							<Radio.Group value={queryParams.status} onChange={handleStatusChange} buttonStyle="solid" size="middle">
								<Radio.Button value="ALL">全部</Radio.Button>
								<Radio.Button value="pending">待处理</Radio.Button>
								<Radio.Button value="confirmed">已确认</Radio.Button>
								<Radio.Button value="shipping">配送中</Radio.Button>
								<Radio.Button value="delivered">已送达</Radio.Button>
								<Radio.Button value="cancelled">已取消</Radio.Button>
							</Radio.Group>
						</div>
					</div>

					{/* 数据表格 */}
					<Table
						rowKey="id"
						columns={columns}
						dataSource={data}
						loading={loading}
						onChange={handleTableChange}
						pagination={{
							current: queryParams.page,
							pageSize: queryParams.pageSize,
							total: total,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (t) => `共 ${t} 条记录`,
							className: "px-6 py-4",
						}}
						className="border-t-0"
						scroll={{ x: 900 }} // 响应式滚动
					/>
				</Card>
			</div>
		</div>
	);
};

export default OrderList;
