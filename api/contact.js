import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const { name, email, project } = req.body;

    // Validate fields
    if (!name || !email || !project) {
      return res.status(400).json({
        success: false,
        error: "Please fill in all required fields.",
      });
    }

    // Send email using Resend
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "manish.9846859444@gmail.com", // <-- Change to your email if needed
      subject: `New enquiry from ${name}`,
      replyTo: email,
      html: `
        <div style="background:#0b1120;padding:32px 16px;font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:560px;margin:0 auto;background:#131c2e;border:1px solid #232f47;border-radius:10px;overflow:hidden;">

            <div style="background:#10b981;padding:20px 28px;">
              <p style="margin:0;color:#070b14;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
                Portfolio Contact Form
              </p>
              <h1 style="margin:6px 0 0;color:#070b14;font-size:20px;font-weight:700;">
                New project enquiry
              </h1>
            </div>

            <div style="padding:28px;">
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;color:#8b96aa;font-size:13px;width:90px;vertical-align:top;">Name</td>
                  <td style="padding:8px 0;color:#e8eaed;font-size:15px;font-weight:600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#8b96aa;font-size:13px;vertical-align:top;">Email</td>
                  <td style="padding:8px 0;">
                    <a href="mailto:${email}" style="color:#10b981;font-size:15px;text-decoration:none;">${email}</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#8b96aa;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
                Project details
              </p>
              <div style="background:#070b14;border:1px solid #232f47;border-radius:6px;padding:16px 18px;color:#e8eaed;font-size:14px;line-height:1.6;">
                ${project.replace(/\n/g, "<br>")}
              </div>

              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #232f47;">
                <a href="mailto:${email}" style="display:inline-block;background:#f2b84b;color:#070b14;font-size:14px;font-weight:600;text-decoration:none;padding:10px 20px;border-radius:6px;">
                  Reply to ${name.split(" ")[0]}
                </a>
              </div>
            </div>

          </div>
          <p style="max-width:560px;margin:16px auto 0;color:#4a5568;font-size:12px;text-align:center;">
            Sent automatically from your portfolio contact form.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Unable to send email.",
    });
  }
}