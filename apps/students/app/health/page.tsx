import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Check - Unpuzzle",
  description: "API health monitoring page",
};

export default function HealthPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Health Status</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-semibold">✅ All systems operational</p>
          <p className="text-sm">Student app is running correctly</p>
        </div>
      </div>
    </div>
  );
} 