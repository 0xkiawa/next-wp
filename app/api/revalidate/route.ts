import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

/**
 * WordPress webhook handler for content revalidation
 * Receives notifications from WordPress when content changes
 * and revalidates the entire site
 */

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const secret = request.headers.get("x-webhook-secret");

    if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");
      return NextResponse.json(
        { message: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    const { contentType, contentId } = requestBody;

    if (!contentType) {
      return NextResponse.json(
        { message: "Missing content type" },
        { status: 400 }
      );
    }

    try {
      console.log("Revalidating entire site");
      revalidatePath("/", "layout");

      return NextResponse.json({
        revalidated: true,
        message: `Revalidated entire site due to ${contentType} update${contentId ? ` (ID: ${contentId})` : ""
          }`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error revalidating path:", error);
      return NextResponse.json(
        {
          revalidated: false,
          message: "Failed to revalidate site",
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating content",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for easy manual cache clearing during development.
 * Usage: http://localhost:3000/api/revalidate?secret=YOUR_SECRET
 * 
 * This allows you to quickly clear the cache without restarting the dev server.
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  // Check secret from query param OR header
  const headerSecret = request.headers.get("x-webhook-secret");
  const isValid = secret === process.env.WORDPRESS_WEBHOOK_SECRET ||
    headerSecret === process.env.WORDPRESS_WEBHOOK_SECRET;

  if (!isValid) {
    return NextResponse.json(
      {
        message: "Invalid secret. Add ?secret=YOUR_WORDPRESS_WEBHOOK_SECRET to the URL",
        hint: "Set WORDPRESS_WEBHOOK_SECRET in your .env file"
      },
      { status: 401 }
    );
  }

  try {
    console.log("[Revalidate] Manual cache clear via GET request");
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      message: "All caches cleared successfully! New WordPress content will appear on next page load.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Revalidate] Error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}

