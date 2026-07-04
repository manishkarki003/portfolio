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
      subject: `🚀 New Portfolio Enquiry from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h2 style="color:#2563eb;">New Portfolio Enquiry</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <hr>

          <h3>Project Details</h3>

          <p>${project.replace(/\n/g, "<br>")}</p>

          <hr>

          <p style="color:#666;">
            This message was sent from your portfolio contact form.
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