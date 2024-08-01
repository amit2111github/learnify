export const isTeacher = (userId: string | null | undefined) => {
  if (!userId) return false;
  return process.env.NEXT_PUBLIC_TEACHER_ID?.split(',').includes(userId);
};
