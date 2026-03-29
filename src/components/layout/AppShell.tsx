import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen md:flex relative z-10 antialiased font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 md:pl-10">
        <Topbar />
        {children}
      </main>
    </div>
  );
}