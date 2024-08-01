import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isCompleted } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!courseId) {
      return new NextResponse('Course ID is required', { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!course) {
      return new NextResponse('Unauthorized', { status: 404 });
    }

    const chapter = await db.chapter.findFirst({
      where: { courseId, id: chapterId },
    });
    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
      update: {
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error('[PUT CHAPTERS_ID_PROGRESS] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
