// src/pages/CustomerPortal/components/header.tsx
import { Layout, Dropdown, Avatar, Typography } from "antd";
import { RocketOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface Props {
  userEmail?: string;
  onLogout: () => void;
}

const Header = ({ userEmail, onLogout }: Props) => {
  return (
    <AntHeader className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm h-16">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
          <RocketOutlined style={{ fontSize: 18 }} />
        </div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">
          物流镜头 · 用户端
        </span>
      </div>

      <Dropdown
        menu={{
          items: [
            {
              key: "1",
              label: "退出登录",
              icon: <LogoutOutlined />,
              danger: true,
              onClick: onLogout,
            },
          ],
        }}
      >
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100/50 py-1 px-2 rounded-full transition-all">
          <Text className="text-slate-600 hidden sm:block">
            {userEmail || "用户"}
          </Text>
          <Avatar style={{ backgroundColor: "#1677ff" }} icon={<UserOutlined />} />
        </div>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;