import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/library", label: "Wars Library" },
  { href: "/timeline", label: "Timeline" },
  { href: "/notes", label: "Notes" },
  { href: "/connections", label: "Connections" },
  { href: "/search", label: "Search" }
];

export default function Sidebar() {
  return (
    <aside className="w-full border-b border-military-700 bg-military-950/90 p-6 md:min-h-screen md:w-72 md:border-b-0 md:border-r backdrop-blur-md shadow-2xl relative z-20">
      <div className="mb-10 pb-6 border-b border-military-800">
        <h2 className="text-xl font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
          <span>{`//`}</span> WAR_HISTORY_OS
        </h2>
        <p className="mt-2 text-[10px] text-military-400 font-mono uppercase tracking-widest">
          Local-first tactical knowledge system
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-sm px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-widest transition-all hover:bg-military-800 hover:text-white border border-transparent hover:border-military-600 focus:outline-none focus:ring-2 focus:ring-military-500"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}