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

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: { isPublished: false },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('[PATCH UNPUBLISH COURSE] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
