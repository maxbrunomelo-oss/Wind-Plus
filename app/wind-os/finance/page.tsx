import React from 'react';
import { getPayments, getStudents } from '@/lib/windos/data';
import FinanceView, { type StudentInfo } from './FinanceView';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  const [payments, students] = await Promise.all([getPayments(), getStudents()]);
  const studentInfo: Record<string, StudentInfo> = Object.fromEntries(
    students.map(s => [s.id, { name: s.fullName, modalidade: s.modalidade }]),
  );
  return <FinanceView payments={payments} studentInfo={studentInfo} />;
}
