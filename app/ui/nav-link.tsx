'use client';
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
const links = [
    {
        name: "About",
        href: "/",
    },
    {
        name: "Blog",
        href: "/blog",
    },
    // {
    //     name: "Projects",
    //     href: "/projects",
    // }
]
export default function NavLink() {
    const pathname = usePathname()
    return (
        <>
            <div className="flex flex-row">
                {links.map(item => {
                    return (
                        <Link href={item.href} key={item.name} className={clsx("text-light-focus hover:text-light-text dark:text-dark-focus dark:hover:text-dark-text md:mt-2 md:text-center mr-5 mt-3",
                            {
                                'text-light-text dark:text-dark-text': pathname === item.href
                            })}>
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}