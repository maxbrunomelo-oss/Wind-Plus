import React from 'react';
import { getStudentLogs, getStudents, nameMap } from '@/lib/windos/data';
import StudentLogsView from './StudentLogsView';

export const dynamic = 'force-dynamic';

export default async function StudentLogsPage() {
  const [logs, students] = await Promise.all([getStudentLogs(), getStudents()]);
  return (
    <StudentLogsView
      logs={logs}
      students={students.map(s => ({ id: s.id, fullName: s.fullName }))}
      studentNameById={nameMap(students, s => s.fullName)}
    />
  );
}
