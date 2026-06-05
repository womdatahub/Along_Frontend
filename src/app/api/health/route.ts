import { NextResponse } from "next/server";

// Always evaluate at request time — a health probe must reflect the live
// process, never a cached/prerendered response.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Liveness/health endpoint for load balancers, container orchestrators
 * GET  /api/health  → { status, uptime, timestamp, ... }
 * HEAD /api/health  → 200 (Next derives HEAD from GET automatically)
 */

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "along-frontend",
      version: process.env.npm_package_version ?? "0.1.0",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        // Probes should never read a cached result.
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
