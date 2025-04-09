import NavLink from "./ui/nav-link";
import "./ui/global.css";
// 导出一个默认的React函数组件RootLayout，该组件接收一个包含children属性的对象作为参数
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // children属性的类型为React.ReactNode，表示可以是任何可以被渲染的React节点
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-40 md:mt-20">
            <NavLink />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-20">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
