console.log("BREVO_API_KEY loaded:", process.env.BREVO_API_KEY);

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email, firstName, lastName, phone } = body;

    // 🧠 Normalize phone number (E.164 format)
    if (phone) {
      phone = phone.trim();
      if (/^0\d{10}$/.test(phone)) {
        // 08012345678 → +2348012345678
        phone = `+234${phone.slice(1)}`;
      } else if (/^234\d{10}$/.test(phone)) {
        // 2348012345678 → +2348012345678
        phone = `+${phone}`;
      } else if (!phone.startsWith("+")) {
        // fallback
        phone = `+${phone}`;
      }
    }

    console.log("📩 Adding contact:", { email, firstName, lastName, phone });

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
          SMS: phone, // ✅ stored under "SMS" in Brevo
        },
        updateEnabled: true, // updates existing contacts
        listIds: [4], // ✅ "your soul mate campaign #4"
      }),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch (e) {
      console.warn("⚠️ Could not parse Brevo JSON response");
    }

    console.log("📨 Brevo response:", res.status, data);

    if (!res.ok) {
      const errorMsg =
        (data && (data.message || data.code || JSON.stringify(data))) ||
        "Unknown Brevo error";
      return NextResponse.json({ ok: false, error: errorMsg }, { status: res.status });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("💥 /api/brevo error:", error);
    return NextResponse.json(
      { ok: false, error: String(error) || "Server error" },
      { status: 500 }
    );
  }
}
