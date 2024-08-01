import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

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

    // Get at least one chapter from the course which is published
    const publishedChapter = await db.chapter.findFirst({
      where: { courseId, isPublished: true },
    });

    const requiredFieldsToPublish = [
      course.price,
      course.title,
      course.description,
      course.price,
      course.imageUrl,
      course.categoryId,
      publishedChapter,
    ];
    const allFieldsPresent = requiredFieldsToPublish.every(Boolean);
    if (!allFieldsPresent) {
      return new NextResponse('Chapter is missing required fields', {
        status: 400,
      });
    }

    // Publish the course
    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('[PATCH PUBLISH CHAPTERS] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
