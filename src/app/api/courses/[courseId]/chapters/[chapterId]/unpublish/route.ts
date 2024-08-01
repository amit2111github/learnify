import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;

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

    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: { isPublished: false },
    });

    // check if atlest one chapter is published in the course otherwise set course isPublished to false
    const publishedChaptersInCourse = await db.chapter.findFirst({
      where: { courseId, isPublished: true },
    });
    if (!publishedChaptersInCourse) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('[PATCH PUBLISH CHAPTERS] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
