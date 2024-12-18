import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: userId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required for revalidation" },
      { status: 400 }
    );
  }

  try {
    console.log(`Revalidating cache for user-${userId}`);
    // Revalidate the cache for this user
    revalidateTag(`user-${userId}`);

    return NextResponse.json(
      { message: `Cache revalidated for user-${userId}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating user cache:", error);
    return NextResponse.json(
      { error: "Failed to revalidate cache" },
      { status: 500 }
    );
  }
}
