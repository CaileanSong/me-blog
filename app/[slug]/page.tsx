import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import Link from 'next/link';


// 获取 Markdown 文件所在的路径
const postsDirectory = path.join(process.cwd(), 'posts');

// 根据 slug 获取文章内容
async function getPostData(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    const processedContent = remark().use(remarkHtml).processSync(content);
    const contentHtml = processedContent.toString();

    return {
        contentHtml,
        title: data.title || 'Undefind', // 设置默认标题
        date: data.date || 'Default Date', // 设置默认日期
    };
}

// 页面组件，params 作为参数传递，异步获取文章内容
export default async function Post(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    // 使用 params.slug 获取文章内容
    const postData = await getPostData(slug);

    if (!postData) {
        notFound();
    }

    return (
        <div className='animate-slideUp w-full'>
            <h2 className="text-light-text [width:33ch] text-3xl font-bold m-auto"># {postData.title}</h2>
            <p className="text-light-time prose m-auto">{postData.date}</p>
            <div className="mt-8 text-light-body prose m-auto" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            <div className='prose m-auto'>
                <Link href='/blog' ><span>cd ..</span></Link>
            </div>

        </div>
    );
}
