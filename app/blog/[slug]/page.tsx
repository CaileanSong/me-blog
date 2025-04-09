import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

interface PageProps {
    params: {
        slug: string;
    };
    // 其他可能的属性...
}
// 获取存放 Markdown 文件的路径
const postsDirectory = path.join(process.cwd(), 'posts');

// 根据 slug 获取文章内容
async function getPostData(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    const processedContent = remark().use(remarkHtml).processSync(content);
    const contentHtml = processedContent.toString();
    console.log(contentHtml)
    return {
        contentHtml,
        ...data,
    };
}

// 使用 `fetch` 或 `Promise` 获取静态数据
export default async function Post({ params }: PageProps) {
    const postData = await getPostData(params.slug);

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4 text-light-text'># {postData.title}</h1>
            <p className='text-light-time'>{postData.date}</p>
            <div className='mt-8 text-light-body prose' dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
    );
}
