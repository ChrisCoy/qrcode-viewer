import prisma from "@/lib/prisma";
import React from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const result = await prisma.qrCode.findFirst({
    where: {
      id: Number(params.id),
    },
  });

  // TODO - check if the result is out of date
  // max of 5 minutes

  // TODO - check if its a qr code

  if (!result) return <div>Not found</div>;

  const qrCodeBase64 =
    "data:image/jpeg;base64," + result?.midia.toString("utf-8");

  return (
    <div>
      {<img src={qrCodeBase64} className="h-96 w-96 object-contain" />}
      <span className="mt-4 text-center block">Scan-me :D</span>
    </div>
  );
}
