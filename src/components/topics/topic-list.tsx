import Link from 'next/link';
import { Chip } from '@nextui-org/react';
import { db } from '@/db';
import paths from '@/path';

export default async function TopicList() {

    const topics = await db.topic.findMany();

    const renderedTopics = topics.map((topics) => {

        return (
            <div key={topics.id}>
                <Link href={paths.topicShowPath(topics.slug)}>
                    <Chip color='warning' size='sm'>{topics.slug}</Chip>
                </Link>
            </div>
        );
    });

    return <div className='flex flex-row gap-2'>
        {renderedTopics}
    </div>
}