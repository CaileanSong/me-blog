"use client"
import NavLink from "./ui/nav-link";
import "./ui/global.css";
import { useEffect, useState } from "react";
// 导出一个默认的React函数组件RootLayout，该组件接收一个包含children属性的对象作为参数
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // children属性的类型为React.ReactNode，表示可以是任何可以被渲染的React节点
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen flex-col md:flex-col md:overflow-hidden bg-light-background dark:bg-dark-background">
          <div className="w-full flex flex-row-reverse mt-6 pr-10">
            <NavLink />
          </div>
          <div className={"flex-grow p-6 md:overflow-y-auto md:p-10 "}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
