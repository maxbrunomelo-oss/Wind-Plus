import Sidebar from "@/components/platform/Sidebar";
import Topbar from "@/components/platform/Topbar";

// Dados mockados — substituir por Supabase session no Módulo 2
const MOCK_STUDENT = {
  name: "Max A.",
  cefrLevel: "B1",
  course: "Fluency",
  streakDays: 12,
  xpTotal: 1240,
};

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#111111]">
      <Sidebar
        studentName={MOCK_STUDENT.name}
        cefrLevel={MOCK_STUDENT.cefrLevel}
        course={MOCK_STUDENT.course}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar streakDays={MOCK_STUDENT.streakDays} xpTotal={MOCK_STUDENT.xpTotal} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
