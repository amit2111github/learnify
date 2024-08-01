import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// POST /api/courses/:courseId/chapters/recorder
// Api to reorder chapters in a course
export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { list } = await request.json();

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

    for (const { id, position } of list) {
      await db.chapter.update({
        where: { id, courseId },
        data: { position: position + 1 },
      });
    }

    return NextResponse.json('Success', { status: 200 });
  } catch (error) {
    console.error('[PUT REORDER] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
