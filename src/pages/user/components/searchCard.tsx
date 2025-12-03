// src/pages/CustomerPortal/components/searchCard.tsx
import { Card, Input, Button, Tag, Typography } from "antd";

const { Title } = Typography;

interface Props {
  onSearch: (value: string) => void;
  loading: boolean;
}

const SearchCard = ({ onSearch, loading }: Props) => {
  return (
    <Card
      bordered={false}
      className="shadow-xl backdrop-blur-xl bg-white/90 border border-white/50 rounded-2xl"
    >
      <Title level={4} className="!mb-4 text-slate-800">
        追踪您的包裹
      </Title>
      <Input.Search
        placeholder="请输入订单号 (如: ORD202401150001)"
        enterButton={
          <Button
            type="primary"
            className="bg-blue-600 font-medium shadow-blue-200 shadow-lg"
          >
            查询
          </Button>
        }
        size="large"
        onSearch={onSearch}
        loading={loading}
        allowClear
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag
          className="text-xs bg-slate-100 border-slate-200 text-slate-500 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onSearch("ORD202401150001")}
        >
          示例订单: ORD202401150001
        </Tag>
      </div>
    </Card>
  );
};

export default SearchCard;