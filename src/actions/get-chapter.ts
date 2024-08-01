import { db } from '@/lib/db';

import { Attachment, Chapter } from '@prisma/client';

type GetChapter = {
  userId: string;
  courseId: string;
  chapterId: string;
};

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapter) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: { price: true },
    });
    if (!course) {
      throw new Error('Course not found');
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
      });
    }

    const progress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      progress,
      purchase: purchase,
    };
  } catch (error) {
    console.error('[getChapter] Error fetching chapter details', error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      progress: null,
      purchase: null,
    };
  }
};
