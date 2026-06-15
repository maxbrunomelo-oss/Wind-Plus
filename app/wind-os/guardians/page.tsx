import React from 'react';
import { getGuardians, getStudents, nameMap } from '@/lib/windos/data';
import GuardiansView from './GuardiansView';

export const dynamic = 'force-dynamic';

export default async function GuardiansPage() {
  const [guardians, students] = await Promise.all([getGuardians(), getStudents()]);
  return (
    <GuardiansView
      guardians={guardians}
      students={students.map(s => ({ id: s.id, name: s.fullName }))}
      studentNameById={nameMap(students, s => s.fullName)}
    />
  );
}
