import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type MyRequest = {
  body: string;
} & Request;

function isBase64Image(base64String: string) {
  const binaryData = atob(base64String);

  // Magic numbers or signature bytes for common image formats
  const magicNumbers = {
    jpeg: [0xff, 0xd8],
    png: [0x89, 0x50, 0x4e, 0x47],
    // 'gif': [0x47, 0x49, 0x46, 0x38]
  } as any;

  for (const format in magicNumbers) {
    const magicBytes = magicNumbers[format];
    if (binaryData.startsWith(String.fromCharCode(...magicBytes))) {
      return true;
    }
  }

  return false; // Not recognized as an image
}

export async function POST(req: MyRequest) {
  const base64 = (await req.text())?.replace(/^data:image\/[^;]+;base64,/, "");

  if (!base64) {
    return new Response("No base64 provided", {
      status: 400,
      statusText: "No base64 provided",
    });
  }

  if (!isBase64Image(base64)) {
    return new Response("Source is not a base64 image", {
      status: 400,
      statusText: "Source is not base64",
    });
  }

  const result = await prisma.qrCode.create({
    data: {
      midia: Buffer.from(base64, "utf8"),
    },
  });

  return new Response(
    JSON.stringify({ link: `${process.env.BASE_URL}/view/${result.id}` }),
    {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
