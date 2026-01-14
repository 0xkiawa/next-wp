import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Untitled";
    const description = searchParams.get("description") || "";
    const imageUrl = searchParams.get("image");
    const category = searchParams.get("category") || "";
    const author = searchParams.get("author") || "";

    // Truncate text
    const displayTitle = title.length > 80 ? title.substring(0, 77) + "..." : title;
    const displayDesc = description.length > 120 ? description.substring(0, 117) + "..." : description;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            padding: 60,
            backgroundColor: "#0f172a",
            backgroundImage: imageUrl
              ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${imageUrl})`
              : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Top: Brand + Category */}
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 60,
              right: 60,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
              }}
            >
              KiawaNotes
            </div>
            {category && (
              <div
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "8px 16px",
                  textTransform: "uppercase",
                }}
              >
                {category}
              </div>
            )}
          </div>

          {/* Bottom: Title, Description, Author */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 900,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.2,
              }}
            >
              {displayTitle}
            </div>

            {displayDesc && (
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.4,
                }}
              >
                {displayDesc}
              </div>
            )}

            {author && (
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 8,
                }}
              >
                By {author}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    // Return a fallback image on error
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            color: "white",
            fontSize: 48,
          }}
        >
          KiawaNotes
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
