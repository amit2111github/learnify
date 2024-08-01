import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, attachmentId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!courseId) {
      return new NextResponse('Course ID is required', { status: 400 });
    }
    if (!attachmentId) {
      return new NextResponse('Attachment ID is required', { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!course) {
      return new NextResponse('Unauthorized', { status: 404 });
    }

    const attachmentRow = await db.attachment.findUnique({
      where: { id: attachmentId, courseId },
    });
    if (!attachmentRow) {
      return new NextResponse('Attachment not found', { status: 404 });
    }

    const attachment = await db.attachment.delete({
      where: { id: attachmentId },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[DELETE] ATTACHMENT_ID API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
