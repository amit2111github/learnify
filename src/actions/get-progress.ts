import { db } from '@/lib/db';
import _ from 'lodash';

export const getProgress = async (
  courseId: string,
  userId: string
): Promise<number> => {
  try {
    const publishedChaptes = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: { id: true },
    });

    const completedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: _.map(publishedChaptes, 'id'),
        },
        isCompleted: true,
      },
    });

    return (completedChapters / publishedChaptes.length) * 100;
  } catch (error) {
    console.error('[getProgress] Error fetching progress', error);
    return 0;
  }
};
