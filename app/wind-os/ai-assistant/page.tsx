import React from 'react';
import { getStudents } from '@/lib/windos/data';
import AIAssistantView from './AIAssistantView';

export const dynamic = 'force-dynamic';

export default async function AIAssistantPage() {
  const students = await getStudents();
  return <AIAssistantView students={students.map(s => ({ id: s.id, fullName: s.fullName }))} />;
}
