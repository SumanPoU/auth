import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Login",
  description: "Sign in to your account",
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}
