import React from 'react';
import { getClasses, getTeachers, getStudents, nameMap } from '@/lib/windos/data';
import ClassesView from './ClassesView';

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
  const [classes, teachers, students] = await Promise.all([getClasses(), getTeachers(), getStudents()]);
  const studentCount: Record<string, number> = {};
  for (const s of students) if (s.classId && s.status !== 'CANCELADO') studentCount[s.classId] = (studentCount[s.classId] ?? 0) + 1;
  return (
    <ClassesView
      classes={classes}
      teachers={teachers.map(t => ({ id: t.id, name: t.name }))}
      teacherNameById={nameMap(teachers, t => t.name)}
      studentCount={studentCount}
    />
  );
}
