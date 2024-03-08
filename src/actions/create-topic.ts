'use server'

import type { Topic } from '@prisma/client';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import paths from '@/path';
import { z } from 'zod';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const createTopicSchema = z.object({
    name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Must be lowercase letters or dashes without spaces'
    }),
    description: z.string().min(10).max(255),
});

interface CreateTopicFormState {
    errors: {
        name?: string[];
        description?: string[];
        _form?: string[];
    };
}

export async function createTopic(formState: CreateTopicFormState,
    formData: FormData): Promise<CreateTopicFormState> {
    
    // await new Promise((resolve) => setTimeout(resolve, 2500));

    const result = createTopicSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        };
    }
    
    const session = await auth();

    if(!session || !session.user){
        return {
            errors: {
                _form: ['You must be logged in to create a topic.'],
            },
        };
    }

    let topic:Topic;
    try {
        topic = await db.topic.create({
            data: {
                slug: result.data.name,
                description: result.data.description,
            }
        });
    } catch(err:unknown) {
        if(err instanceof Error){
            return {
                errors: {
                    _form: [err.message],
                },
            };
        } else {
            return {
                errors: {
                    _form: ['An unknown error occurred'],
                },
            };
        }
    }

    revalidatePath('/');
    redirect(paths.topicShowPath(topic.slug));
}