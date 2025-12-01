import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { message: "Missing token or email" },
        { status: 400 }
      );
    }

    // Find and validate token
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      await db.verificationToken.delete({ where: { token } });
      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Check if email matches
    if (verificationToken.identifier !== email.toLowerCase()) {
      return NextResponse.json({ message: "Email mismatch" }, { status: 400 });
    }

    // Update user email verification
    await db.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await db.verificationToken.delete({ where: { token } });

    // Redirect to success page or login
    return NextResponse.redirect(
      new URL("/email-verified?success=true", req.url)
    );
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Email verification failed" },
      { status: 500 }
    );
  }
}
