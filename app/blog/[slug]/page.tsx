import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { GetStaticPaths, GetStaticProps } from 'next';

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
// 动态获取静态路径
export const getStaticPaths: GetStaticPaths = async () => {
    const fileNames = fs.readdirSync(postsDirectory);
    const paths = fileNames.map((fileName) => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, ''), // 提取 slug
            },
        };
    });

    return {
        paths,
        fallback: false, // 设置为 false，表示其他的路径返回 404
    };
};

// 获取每个页面的静态数据
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params?.slug as string);

    return {
        props: {
            postData,
        },
    };
};

// 使用 `fetch` 或 `Promise` 获取静态数据
export default async function Post({ params }: { params: { slug: string } }) {
    const postData = await getPostData(params.slug);

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4 text-light-text'># {postData.title}</h1>
            <p className='text-light-time'>{postData.date}</p>
            <div className='mt-8 text-light-body prose' dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
    );
}
