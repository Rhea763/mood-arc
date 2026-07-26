import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/config";

export async function GET() {
  return NextResponse.json({ mock: isMockMode() });
}
