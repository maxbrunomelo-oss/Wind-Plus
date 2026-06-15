import Image from "next/image";
import Link from "next/link";
import WindPlusWordmark from "@/components/ui/WindPlusWordmark";

interface AdminHeaderProps {
  userEmail?: string | null;
  activeTab?: "results" | "certificates";
}

export default function AdminHeader({ userEmail, activeTab }: AdminHeaderProps) {
  return (
    <header className="bg-[#111111] border-b border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-0 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-wind-plus.png"
              alt="Wind Plus"
              width={32}
              height={32}
              className="h-8 w-8 object-contain brightness-0 invert"
            />
            <WindPlusWordmark size="text-sm" windColor="text-white" plusColor="text-[#E30613]" />
            <span className="hidden sm:block text-gray-500 text-xs ml-2 border-l border-gray-700 pl-2">
              Painel Administrativo
            </span>
          </div>
          <span className="text-xs text-gray-500">{userEmail}</span>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-1 -mb-px">
          <NavTab
            href="/admin"
            label="← Central"
            active={false}
          />
          <NavTab
            href="/admin/placement-results"
            label="📊 Resultados"
            active={activeTab === "results"}
          />
          <NavTab
            href="/admin/certificates"
            label="🎓 Certificados"
            active={activeTab === "certificates"}
          />
        </nav>
      </div>
    </header>
  );
}

function NavTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? "border-[#E30613] text-white"
          : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
      }`}
    >
      {label}
    </Link>
  );
}
