import React from 'react';
import { notFound } from 'next/navigation';
import {
  getStudent, getGuardians, getPayments, getStudentLogs, getAlerts,
  getPedagogicalReports, getTeachers, getClasses, nameMap,
} from '@/lib/windos/data';
import ProfileView from './ProfileView';

export const dynamic = 'force-dynamic';

export default async function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) return notFound();

  const [allGuardians, allPayments, allLogs, allAlerts, allReports, teachers, classes] = await Promise.all([
    getGuardians(), getPayments(), getStudentLogs(), getAlerts(), getPedagogicalReports(), getTeachers(), getClasses(),
  ]);

  const guardians = allGuardians.filter(g => g.studentIds.includes(id));
  const payments = allPayments.filter(p => p.studentId === id);
  const logs = allLogs.filter(l => l.studentId === id);
  const alerts = allAlerts.filter(a => a.studentId === id && a.status !== 'RESOLVIDO');
  const reports = allReports.filter(r => r.studentId === id);
  const revenue = payments.filter(p => p.status === 'PAGO').reduce((sum, p) => sum + p.finalAmount, 0);
  const open = payments.filter(p => p.status === 'PENDENTE' || p.status === 'ATRASADO').reduce((sum, p) => sum + p.finalAmount, 0);

  const teacherNameById = nameMap(teachers, t => t.name);
  const classNameById = nameMap(classes, c => c.name);

  return (
    <ProfileView
      student={student}
      guardians={guardians}
      payments={payments}
      logs={logs}
      alerts={alerts}
      reports={reports}
      revenue={revenue}
      open={open}
      className={(student.classId && classNameById[student.classId]) || '—'}
      teacherName={(student.teacherId && teacherNameById[student.teacherId]) || '—'}
      teacherNameById={teacherNameById}
    />
  );
}
