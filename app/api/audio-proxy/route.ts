//Audio proxy to handle HTTP sources on HTTPS site (Mixed Content fix)
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get("url");

    if (!audioUrl) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Only allow proxying from your WordPress domain for security
    const allowedDomain = "kiawanotes.atwebpages.com";
    try {
        const urlObj = new URL(audioUrl);
        if (!urlObj.hostname.includes(allowedDomain)) {
            return NextResponse.json({ error: "Unauthorized domain" }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    try {
        const response = await fetch(audioUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; AudioProxy/1.0)",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch audio: ${response.status}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get("content-type") || "audio/mpeg";
        const contentLength = response.headers.get("content-length");

        const headers: HeadersInit = {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
        };

        if (contentLength) {
            headers["Content-Length"] = contentLength;
        }

        // Stream the audio data
        return new NextResponse(response.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Audio proxy error:", error);
        return NextResponse.json({ error: "Failed to proxy audio" }, { status: 500 });
    }
}
