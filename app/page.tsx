import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>War History OS</h1>
      <p>Your local-first war research system is starting...</p>

      <div style={{ marginTop: "20px", display: "grid", gap: "10px" }}>
        <Link href="/dashboard">Go to Dashboard</Link>
        <Link href="/library">Go to Wars Library</Link>
        <Link href="/timeline">Go to Timeline</Link>
        <Link href="/notes">Go to Notes</Link>
        <Link href="/connections">Go to Connections</Link>
        <Link href="/search">Go to Search</Link>
      </div>
    </div>
  );
}