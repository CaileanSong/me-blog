import Link from 'next/link';
import { getGroupedPostsByYear } from '../lib/posts';

function getMonthName(date: string) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNumber = Number.parseInt(date.split('-')[1] ?? '1', 10);
  return monthNames[monthNumber - 1] ?? 'Jan';
}

function getDay(date: string) {
  return Number.parseInt(date.split('-')[2] ?? '1', 10);
}

export default async function Page() {
  const groupedPosts = getGroupedPostsByYear();

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slideUp">
      <h1 className="text-4xl mb-4 text-light-text dark:text-dark-text">posts</h1>
      {groupedPosts.map(({ year, posts }) => (
        <section key={year} className="mt-20">
          <div className="relative text slide-enter pointer-events-none">
            <div className="absolute text-9xl opacity-10 font-bold -top-16 -left-10 text-light-text dark:text-dark-text">
              {year}
            </div>
          </div>
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id} className="group">
                <Link
                  href={`/blog/${post.id}`}
                  className="text-xl text-light-focus dark:text-dark-focus group-hover:text-light-text dark:group-hover:text-dark-text transition duration-5000"
                >
                  <span>{post.title}</span>
                </Link>
                <span className="text-sm text-light-gray dark:text-dark-focus group-hover:text-light-focus dark:group-hover:text-dark-text cursor-pointer transition duration-5000">
                  &nbsp;&nbsp;&nbsp;{getMonthName(post.date)} {getDay(post.date)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
