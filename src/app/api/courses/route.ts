import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const { title } = await request.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    const newCourse = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error('[POST] Courses API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
