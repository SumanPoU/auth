import { db } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { success, z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = RegisterSchema.parse(body);
    const hashed_password = await hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed_password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
