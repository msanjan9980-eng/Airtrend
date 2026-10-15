import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const REDIS_LIST_KEY = "airtrend:readings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Row {
  timestamp: string;
  reading: number;
  arduino_baseline: number;
  difference: number;
  rolling_mean: number;
  rolling_std: number;
  trend_per_sample: number;
  status: string;
}

export async function GET() {
  try {
    const raw = await redis.lrange<string>(REDIS_LIST_KEY, 0, 899);
    const rows: Row[] = raw
      .map((item) => {
        try {
          return typeof item === "string" ? JSON.parse(item) : item;
        } catch {
          return null;
        }
      })
      .filter((r): r is Row => r !== null);

    rows.reverse();

    let stats = {
      current: null as Row | null,
      totalReadings: 0,
      watchCount: 0,
      anomalyCount: 0,
      avgReading: 0,
      maxReading: 0,
      minReading: 0,
      uptime: "0s",
    };

    if (rows.length > 0) {
      const readings = rows.map((r) => r.reading).filter(Number.isFinite);
      const watchCount = rows.filter((r) => r.status === "WATCH").length;
      const anomalyCount = rows.filter((r) => r.status === "ANOMALY").length;

      const first = new Date(rows[0].timestamp).getTime();
      const last = new Date(rows[rows.length - 1].timestamp).getTime();
      const seconds = Math.max(0, Math.floor((last - first) / 1000));
      const uptime = seconds > 3600
        ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
        : seconds > 60
        ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
        : `${seconds}s`;

      stats = {
        current: rows[rows.length - 1],
        totalReadings: rows.length,
        watchCount,
        anomalyCount,
        avgReading: readings.reduce((a, b) => a + b, 0) / readings.length,
        maxReading: Math.max(...readings),
        minReading: Math.min(...readings),
        uptime,
      };
    }

    return NextResponse.json(
      { rows, stats, generatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Redis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Redis", rows: [], stats: null },
      { status: 500 }
    );
  }
}
