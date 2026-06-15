import React from 'react';
import { getStudents, getTeachers, getClasses, nameMap } from '@/lib/windos/data';
import StudentsView from './StudentsView';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
  const [students, teachers, classes] = await Promise.all([getStudents(), getTeachers(), getClasses()]);
  return (
    <StudentsView
      students={students}
      teachers={teachers.map(t => ({ id: t.id, name: t.name }))}
      classes={classes.map(c => ({ id: c.id, name: c.name }))}
      teacherNameById={nameMap(teachers, t => t.name)}
      classNameById={nameMap(classes, c => c.name)}
    />
  );
}
