import { Category, Chapter, Course } from '@prisma/client';
import { db } from '@/lib/db';
import { getProgress } from './get-progress';

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type GetDashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  courseInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<GetDashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchasedCourse) => purchasedCourse.course
    ) as CourseWithProgressWithCategory[];

    for (const course of courses) {
      const courseProgress = await getProgress(course.id, userId);
      course.progress = courseProgress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );

    const courseInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return { completedCourses, courseInProgress };
  } catch (error) {
    console.log('Error in getDashboardCourses', error);
    return {
      completedCourses: [],
      courseInProgress: [],
    };
  }
};
