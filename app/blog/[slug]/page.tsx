import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostData } from '../../lib/posts';

export default async function Post(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }

  return (
    <div className="animate-slideUp w-full">
      <h2 className="text-light-text dark:text-dark-text [width:33ch] text-3xl font-bold m-auto">
        # {postData.title}
      </h2>
      <p className="text-light-time dark:text-gray-400 prose dark:prose-invert m-auto">
        {postData.date}
      </p>
      <div
        className="mt-8 text-light-body dark:text-gray-300 prose dark:prose-invert m-auto"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
      <div className="prose dark:prose-invert m-auto">
        <Link href="/blog">
          <span>cd ..</span>
        </Link>
      </div>
    </div>
  );
}
