import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import Mux from '@mux/mux-node';
import { isTeacher } from '@/lib/teacher';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const payload = await request.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!courseId) {
      return new NextResponse('Course ID is required', { status: 400 });
    }

    const course = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: payload,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('[POST] Courses_ID API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
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

    const course = await db.course.findFirst({
      where: { id: courseId, userId },
    });
    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }

    const muxDataRows = await db.muxData.findMany({
      where: { chapter: { courseId } },
    });
    // Delete all the mux data for the course
    for (const muxDataRow of muxDataRows) {
      await mux.video.assets.delete(muxDataRow.assetId);
      // No need to do this as we have a cascade delete in the database
      // await db.muxData.delete({ where: { id: muxDataRow.id } });
    }

    // Delete the course
    await db.course.delete({ where: { id: courseId } });

    return NextResponse.json('Course deleted successfully', { status: 200 });
  } catch (error) {
    console.error('[DELETE COURSE] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
