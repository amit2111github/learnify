import { db } from '@/lib/db';
import _ from 'lodash';

import { getProgress } from './get-progress';
import { Category, Course } from '@prisma/client';

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: 'insensitive',
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: { id: true },
        },
        purchases: {
          where: {
            userId,
          },
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const coursesWithProgress = await Promise.all(
      _.map(courses, async (course) => {
        if (!course.purchases.length) {
          return {
            ...course,
            progress: null,
          };
        }

        const progress = await getProgress(course.id, userId);

        return {
          ...course,
          progress,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.error('[getCourses] Error fetching courses', error);
    return [];
  }
};
