import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await request.json();

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
      data: { ...values },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });
      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }

      // create asset in mux
      const muxVideo = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ['public'],
        test: false,
      });

      // update chapter with mux data
      await db.muxData.create({
        data: {
          assetId: muxVideo.id,
          playbackId: muxVideo.playback_ids?.[0]?.id,
          chapterId,
        },
      });
    }

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('[PATCH CHAPTERS] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
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

    // Clear the mux data if video exists
    if (chapter.videoUrl) {
      const muxData = await db.muxData.findFirst({
        where: { chapterId },
      });
      if (muxData) {
        await mux.video.assets.delete(muxData.assetId);
        await db.muxData.delete({ where: { id: muxData.id } });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: { id: chapterId },
    });

    // Check if any other chapter is published in the course
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });
    if (publishedChapters.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json('Chapter deleted successfully', { status: 200 });
  } catch (error) {
    console.error('[DELETE CHAPTERS] API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
