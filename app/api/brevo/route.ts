console.log("BREVO_API_KEY loaded:", process.env.BREVO_API_KEY);

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    console.log("BREVO_API_KEY length:", process.env.BREVO_API_KEY?.length)
    if (!process.env.BREVO_API_KEY) {
      console.log("⚠️ BREVO_API_KEY not set");
      return NextResponse.json({ ok: false, error: "BREVO_API_KEY not set" }, { status: 500 });
    }

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
        },
        updateEnabled: true, // updates if user already exists
        listIds: [2], // optional: ID of your Brevo contact list
      }),
    });

    let data: any = null
    try {
      data = await res.json();
    } catch {}
    console.log("📨 Brevo response:", res.status, data);

    if (!res.ok) {
      const errorMsg = (data && (data.message || data.code || JSON.stringify(data))) || "Brevo error"
      return NextResponse.json({ ok: false, error: errorMsg }, { status: res.status });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("/api/brevo error:", error);
    return NextResponse.json({ ok: false, error: String(error) || "Server error" }, { status: 500 });
  }
}


