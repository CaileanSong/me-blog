"use client"
import CodeSliceBackground from "./ui/code-slice-background";
import NavLink from "./ui/nav-link";
import "./ui/global.css";
import { useState } from "react";
// 导出一个默认的React函数组件RootLayout，该组件接收一个包含children属性的对象作为参数
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // children属性的类型为React.ReactNode，表示可以是任何可以被渲染的React节点
}) {

  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }
  return (
    <html lang="en">
      <body>
        <div className={darkMode ? 'dark' : ''}>
          <div className="relative flex h-screen flex-col md:flex-col md:overflow-hidden bg-light-background dark:bg-dark-background transition-all duration-500">
            <CodeSliceBackground darkMode={darkMode} />
            <div className="relative z-10 w-full flex flex-row-reverse mt-6 pr-10">
              <NavLink onAction={toggleDarkMode} darkMode={darkMode} />
            </div>
            <div className={"relative z-10 flex-grow p-6 md:overflow-y-auto md:p-10 "}>
              {children}
            </div>
          </div>
        </div>

      </body>
    </html>
  );
}
