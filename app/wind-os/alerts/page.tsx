import React from 'react';
import { getAlerts, getStudents, nameMap } from '@/lib/windos/data';
import AlertsView from './AlertsView';

export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  const [alerts, students] = await Promise.all([getAlerts(), getStudents()]);
  return <AlertsView alerts={alerts} studentNameById={nameMap(students, s => s.fullName)} />;
}
