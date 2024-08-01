import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { title } = await request.json();

    if (!userId || !isTeacher(userId)) {
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

    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: 'desc' },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const newChapter = await db.chapter.create({
      data: {
        courseId,
        title,
        position: newPosition,
      },
    });

    return NextResponse.json(newChapter);
  } catch (error) {
    console.error('[POST CHAPTERS] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
