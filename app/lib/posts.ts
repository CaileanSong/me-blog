import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostMeta = {
  id: string;
  title: string;
  date: string;
};

export type PostData = PostMeta & {
  contentHtml: string;
};

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id: fileName.replace(/\.md$/, ''),
        title: data.title ?? 'Untitled',
        date: data.date ?? '1970-01-01',
      };
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}
export function getGroupedPostsByYear() {
  const groups = new Map<string, PostMeta[]>();

  for (const post of getAllPosts()) {
    const year = post.date.split('-')[0] ?? 'Unknown';
    const yearPosts = groups.get(year) ?? [];
    yearPosts.push(post);
    groups.set(year, yearPosts);
  }

  return Array.from(groups.entries()).map(([year, posts]) => ({
    year,
    posts,
  }));
}
export async function getPostData(slug: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(remarkHtml).process(content);

  return {
    id: slug,
    title: data.title ?? 'Untitled',
    date: data.date ?? '1970-01-01',
    contentHtml: processedContent.toString(),
  };
}
