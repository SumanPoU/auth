import transporter from "@/lib/transporter";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&email=${email}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background:#f7f7f7; padding:40px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
      <tr>
        <td align="center">
          <table style="max-width:560px; width:100%; background:#ffffff; border-radius:10px; padding:32px;">
            <tr>
              <td style="text-align:center;">
                <h2 style="font-size:24px; color:#111; margin-bottom:8px;">
                  Welcome ${name || "User"} 👋
                </h2>
                <p style="font-size:15px; color:#444; line-height:1.6;">
                  Thanks for signing up! Please verify your email address to complete your registration.
                </p>
                <div style="margin:32px 0;">
                  <a href="${verificationUrl}"
                    style="background:#3b82f6; color:#fff; text-decoration:none; 
                           padding:14px 28px; border-radius:6px; font-weight:600; 
                           display:inline-block; font-size:15px;">
                    Verify Email
                  </a>
                </div>
                <p style="font-size:13px; color:#666;">
                  This link will expire in <strong>5 minutes</strong>.
                </p>
                <hr style="margin:32px 0; border:none; border-top:1px solid #e5e5e5;">
                <p style="font-size:12px; color:#999; line-height:1.5;">
                  If you did not create an account, please ignore this email.
                </p>
              </td>
            </tr>
          </table>
          <p style="font-size:12px; color:#aaa; margin-top:20px;">
            &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email address",
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
  }
}
