import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  // Placeholder implementation - uploading not implemented
  return NextResponse.json({ ok: true });
}
