import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Site Analytics - 网站监测工具",
  description: "实时网站监测和数据分析平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
