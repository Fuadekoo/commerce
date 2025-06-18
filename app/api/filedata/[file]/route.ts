import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);

// Define the directory where your files are stored.
// For security, this should ideally be outside the `public` folder if these are not meant to be directly public.
// Ensure this path is correct relative to your project root.
const FILE_STORAGE_PATH = path.resolve(process.cwd(), "filedata");

// Helper function to get MIME type (can be expanded)
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream"; // Generic binary type
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { file: string } }
) {
  const filename = params.file;

  if (!filename) {
    return new NextResponse(JSON.stringify({ error: "Filename is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Basic security: Prevent path traversal attacks
  if (filename.includes("..") || filename.includes("/")) {
    return new NextResponse(JSON.stringify({ error: "Invalid filename" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const filePath = path.join(FILE_STORAGE_PATH, filename);

  try {
    // Check if file exists and is a file (not a directory)
    const stats = await statAsync(filePath);
    if (!stats.isFile()) {
      return new NextResponse(JSON.stringify({ error: "Not a file" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileBuffer = await readFileAsync(filePath);
    const mimeType = getMimeType(filePath);

    // For display in browser, Content-Disposition is not strictly needed for images
    // but can be useful for other file types or to suggest a filename on download.
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stats.size.toString(),
        // "Content-Disposition": `inline; filename="${filename}"`, // Use 'inline' for display
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT"
    ) {
      return new NextResponse(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Error serving file:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
