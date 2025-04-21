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
    // allPostsData根据年分组
    const groupByYear = allPostsData.reduce((acc, cur) => {
        const year = getYear(cur.date);
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(cur);
        return acc;
    }, {})
    return groupByYear;
}

// 获取日期的月份并转化为英文缩写
function getMonthName(date: string) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNumber = parseInt(date.split('-')[1]);
    return monthNames[monthNumber - 1];
}
// 获取日期获取日
function getDay(date: string) {
    const day = parseInt(date.split('-')[2]);
    return day;
}

// 获取日期获取年
function getYear(date: string) {
    const year = parseInt(date.split('-')[0]);
    return year;
}


export default async function Page() {
    const groupByYear = await getAllPostData();

    return (
        <div className='w-full max-w-2xl mx-auto p-4 animate-slideUp'>
            <h1 className='text-4xl mb-4'>posts</h1>
            {Object.entries(groupByYear).map(([year, events]) => (
                <div key={year} className='mt-20'>
                    <div className='relative text slide-enter pointer-events-none'>
                        <div className=' absolute text-9xl opacity-10 font-bold -top-16 -left-8'>{year}</div>
                    </div>
                    <ul>
                        {events.map(event => (
                            // <li key={event.id}>
                            //     <h3>{event.title}</h3>
                            //     <p>{event.date}</p>
                            // </li>
                            <div key={event.id} className='group'>
                                <Link href={`/${event.id}`} className='text-xl text-light-focus group-hover:text-light-text transition duration-5000'>
                                    <span >{event.title}</span>
                                </Link>
                                <span className='text-sm text-light-gray group-hover:text-light-focus cursor-pointer transition duration-5000'>&nbsp;&nbsp;&nbsp;{getMonthName(event.date)} {getDay(event.date)}</span>
                            </div>
                        ))}
                    </ul>
                </div>
            ))}
            {/* {allPostsData.map(({ id, title, date }) => (
                <div key={id} className='group'>
                    <Link href={`/${id}`} className='text-xl text-light-focus group-hover:text-light-text transition duration-5000'>
                        <span >{title}</span>
                    </Link>
                    <span className='text-sm text-light-gray group-hover:text-light-focus cursor-pointer transition duration-5000'>&nbsp;&nbsp;&nbsp;{getMonthName(date)} {getDay(date)}</span>
                </div>
            ))} */}
        </div>
    );
}
