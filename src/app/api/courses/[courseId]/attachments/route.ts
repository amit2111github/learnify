import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { url } = await request.json();

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

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[POST] Courses_ID_ATTACHMENTS API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
