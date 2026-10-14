import { NextResponse } from "next/server";
import { loadCsv, computeStats } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const rows = loadCsv();
  const stats = computeStats(rows);
  return NextResponse.json(
    { rows: rows.slice(-300), stats, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
