import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// 获取存放 Markdown 文件的路径
const postsDirectory = path.join(process.cwd(), 'posts');

// 获取所有 Markdown 文件的元数据
async function getAllPostData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
            id: fileName.replace(/\.md$/, ''),
            title: data.title,
            date: data.date,
        };

    });
    return allPostsData;
}

// 使用 `fetch` 或 `Promise` 获取静态数据
export default async function Page() {
    const allPostsData = await getAllPostData();

    return (
        <div>
            <h1>posts</h1>
            {allPostsData.map(({ id, title, date }) => (
                <div key={id} className='flex items-center mt-2'>
                    <Link href={`/blog/${id}`} className='flex-1 max-w-xs truncate text-light-focus hover:text-light-text dark:text-dark-focus dark:hover:text-dark-text '>
                        <span >{title}</span>
                    </Link>
                    <span className='ml-2 whitespace-nowrap'>{date}</span>
                </div>
            ))}
        </div>
    );
}
