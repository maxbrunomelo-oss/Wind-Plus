import React from 'react';
import { getEnrollments, getStudents, getClasses, nameMap } from '@/lib/windos/data';
import EnrollmentsView from './EnrollmentsView';

export const dynamic = 'force-dynamic';

export default async function EnrollmentsPage() {
  const [enrollments, students, classes] = await Promise.all([getEnrollments(), getStudents(), getClasses()]);
  return (
    <EnrollmentsView
      enrollments={enrollments}
      students={students.map(s => ({ id: s.id, name: s.fullName }))}
      classes={classes.map(c => ({ id: c.id, name: c.name }))}
      studentNameById={nameMap(students, s => s.fullName)}
      classNameById={nameMap(classes, c => c.name)}
    />
  );
}
