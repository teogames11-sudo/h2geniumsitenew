import { NextResponse } from "next/server";

type LeadPayload = {
  company?: string;
  city?: string;
  info?: string;
  phone?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as LeadPayload;
  const webhook = process.env.BITRIX_WEBHOOK_URL;
  const titleTemplate = process.env.BITRIX_LEAD_TITLE_TEMPLATE || "Заявка с сайта H2GENIUM";

  if (!webhook) {
    console.warn("[lead] BITRIX_WEBHOOK_URL not configured. Payload:", body);
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const payload = {
      fields: {
        TITLE: titleTemplate,
        NAME: body.company || "",
        COMMENTS: [
          body.city && `Город: ${body.city}`,
          body.info && `Интерес: ${body.info}`,
          body.phone && `Телефон: ${body.phone}`,
        ]
          .filter(Boolean)
          .join("\n"),
        PHONE: body.phone ? [{ VALUE: body.phone, VALUE_TYPE: "WORK" }] : [],
      },
    };

    const response = await fetch(`${webhook}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[lead] Bitrix error:", errorText);
      return NextResponse.json({ ok: false, error: "Bitrix rejected request" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[lead] Unexpected error", error);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
