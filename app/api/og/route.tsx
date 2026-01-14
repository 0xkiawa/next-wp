import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Helper to fetch image and convert to base64 data URL
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGImageBot/1.0)",
      },
    });

    if (!response.ok) {
      console.log(`Failed to fetch image: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.log(`Error fetching image: ${error}`);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get params from the URL query
    const title = searchParams.get("title") || "Untitled";
    const description = searchParams.get("description") || "";
    const imageUrl = searchParams.get("image");
    const category = searchParams.get("category") || "";
    const author = searchParams.get("author") || "";

    // Truncate title if too long
    const truncatedTitle = title.length > 80 ? title.substring(0, 77) + "..." : title;

    // Truncate description if too long
    const truncatedDesc = description.length > 120 ? description.substring(0, 117) + "..." : description;

    // Fetch the background image if provided
    let backgroundImageData: string | null = null;
    if (imageUrl) {
      backgroundImageData = await fetchImageAsBase64(imageUrl);
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            position: "relative",
            backgroundColor: "#111",
          }}
        >
          {/* Background Image */}
          {backgroundImageData && (
            <img
              src={backgroundImageData}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Gradient Overlay for text readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: backgroundImageData
                ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 100%)"
                : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              display: "flex",
            }}
          />

          {/* Content Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "50px 60px",
            }}
          >
            {/* Top Section: Brand + Category */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              {/* Brand Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "white",
                    letterSpacing: "-0.02em",
                  }}
                >
                  KiawaNotes
                </div>
              </div>

              {/* Category Badge */}
              {category && (
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#dc2626",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "8px 20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {category}
                </div>
              )}
            </div>

            {/* Bottom Section: Title + Description + Author */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "900px",
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                {truncatedTitle}
              </div>

              {/* Description */}
              {truncatedDesc && (
                <div
                  style={{
                    fontSize: 22,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.4,
                    fontStyle: "italic",
                  }}
                >
                  {truncatedDesc}
                </div>
              )}

              {/* Author */}
              {author && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "2px",
                      backgroundColor: "#dc2626",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 16,
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    By {author}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`OG Image Error: ${e.message}`);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
