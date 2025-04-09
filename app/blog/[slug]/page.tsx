import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

// 获取 Markdown 文件所在的路径
const postsDirectory = path.join(process.cwd(), 'posts');

// 根据 slug 获取文章内容
function getPostData(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    const processedContent = remark().use(remarkHtml).processSync(content);
    const contentHtml = processedContent.toString();

    return {
        contentHtml,
        ...data,
    };
}

// 页面组件，params 作为参数传递，异步获取文章内容
export default function Post({ params }: { params: { slug: string } }) {
    // 使用 params.slug 获取文章内容
    const postData = getPostData(params.slug);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-light-text"># {postData.title}</h1>
            <p className="text-light-time">{postData.date}</p>
            <div className="mt-8 text-light-body prose" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
    );
}
