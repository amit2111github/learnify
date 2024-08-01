import { db } from '@/lib/db';
import { Course, Purchase } from '@prisma/client';

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    if (!grouped[purchase.course.title]) {
      grouped[purchase.course.title] = 0;
    }
    grouped[purchase.course.title] += purchase.course.price!;
  });
  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: { userId },
      include: { course: true },
    });

    const groupedEarning = groupByCourse(purchases);
    const data = Object.keys(groupedEarning).map((courseTitle) => ({
      name: courseTitle,
      total: groupedEarning[courseTitle],
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log('Error in getAnalytics', error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
