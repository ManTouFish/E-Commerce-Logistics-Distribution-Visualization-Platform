// src/pages/CustomerPortal/config/theme.ts
import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: 8,
  },
  components: {
    Button: { controlHeight: 40 },
    Input: { controlHeight: 40 },
    Card: { boxShadowTertiary: "0 10px 40px -10px rgba(22, 119, 255, 0.15)" },
  },
};