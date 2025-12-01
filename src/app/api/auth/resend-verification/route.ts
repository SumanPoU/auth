import { db } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/services/email-verification";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const ResendSchema = z.object({
  email: z.string().email("Invalid email"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = ResendSchema.parse(body);

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Delete existing tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: email.toLowerCase() },
    });

    // Generate new verification token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await db.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token,
        expires,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      token,
      user.name || "User"
    );

    if (!emailSent) {
      return NextResponse.json(
        { message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to resend email" },
      { status: 500 }
    );
  }
}
