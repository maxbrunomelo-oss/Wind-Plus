import React from 'react';
import { getTeachers, getClasses, getStudents } from '@/lib/windos/data';
import TeachersView from './TeachersView';

export const dynamic = 'force-dynamic';

export default async function TeachersPage() {
  const [teachers, classes, students] = await Promise.all([getTeachers(), getClasses(), getStudents()]);
  const classesCount: Record<string, number> = {};
  const studentsCount: Record<string, number> = {};
  for (const c of classes) if (c.teacherId) classesCount[c.teacherId] = (classesCount[c.teacherId] ?? 0) + 1;
  for (const s of students) if (s.teacherId && s.status !== 'CANCELADO') studentsCount[s.teacherId] = (studentsCount[s.teacherId] ?? 0) + 1;
  return <TeachersView teachers={teachers} classesCount={classesCount} studentsCount={studentsCount} />;
}
