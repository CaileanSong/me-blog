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
export default function NavLink({
    onAction,
    darkMode,
}: {
    onAction: () => void;
    darkMode: boolean;
}) {
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
                <button
                    type="button"
                    onClick={onAction}
                    aria-label="Toggle dark mode"
                    aria-pressed={darkMode}
                    className="md:mt-2 md:text-center mr-5 mt-3 inline-flex items-center justify-center text-light-focus hover:text-light-text dark:text-dark-focus dark:hover:text-dark-text transition"
                >
                    {darkMode ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                            <path d="M21 13.2A9 9 0 1 1 10.8 3a7 7 0 1 0 10.2 10.2Z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" aria-hidden="true">
                            <circle cx="12" cy="12" r="4" strokeWidth="2" />
                            <path strokeLinecap="round" strokeWidth="2" d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" />
                        </svg>
                    )}
                </button>

            </div>
        </>
    )
}
