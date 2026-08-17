import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Escape user-provided content before inserting it into HTML.
 * This prevents submitted form data from being interpreted as HTML.
 */
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { name, email, project } = req.body || {};

    // Basic validation
    if (!name || !email || !project) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and project are required.",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    // Escape all user-controlled values before putting them into HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeProject = escapeHtml(project).replace(/\n/g, "<br>");

    const { data, error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ||
        "Portfolio Contact <onboarding@resend.dev>",

      to: [
        process.env.CONTACT_TO_EMAIL ||
          "manish.9846859444@gmail.com",
      ],

      replyTo: email,

      subject: `New portfolio inquiry from ${name}`,

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>New Portfolio Inquiry</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    width:100%;
    background-color:#0b1120;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    color:#e8eaed;
  "
>

  <!-- Preheader text -->
  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
      color:transparent;
      font-size:1px;
      line-height:1px;
    "
  >
    New portfolio contact request from ${safeName}
  </div>

  <!-- Outer wrapper -->
  <table
    role="presentation"
    cellpadding="0"
    cellspacing="0"
    border="0"
    width="100%"
    style="
      width:100%;
      margin:0;
      padding:0;
      background-color:#0b1120;
    "
  >
    <tr>
      <td
        align="center"
        style="
          padding:40px 16px;
        "
      >

        <!-- Main container -->
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="
            width:100%;
            max-width:620px;
            background-color:#131c2e;
            border:1px solid #232f47;
            border-radius:14px;
            overflow:hidden;
          "
        >

          <!-- Accent line -->
          <tr>
            <td
              style="
                height:4px;
                background-color:#10b981;
                font-size:0;
                line-height:0;
              "
            >
              &nbsp;
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td
              style="
                padding:34px 36px 28px 36px;
                border-bottom:1px solid #232f47;
              "
            >

              <!-- Small label -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    style="
                      font-family:'Courier New',Courier,monospace;
                      font-size:11px;
                      line-height:16px;
                      font-weight:bold;
                      letter-spacing:1.5px;
                      text-transform:uppercase;
                      color:#10b981;
                    "
                  >
                    PORTFOLIO / CONTACT
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1
                style="
                  margin:14px 0 8px 0;
                  padding:0;
                  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                  font-size:28px;
                  line-height:36px;
                  font-weight:700;
                  letter-spacing:-0.5px;
                  color:#e8eaed;
                "
              >
                New project inquiry
              </h1>

              <!-- Intro -->
              <p
                style="
                  margin:0;
                  padding:0;
                  font-size:15px;
                  line-height:24px;
                  color:#8b96aa;
                "
              >
                Someone has submitted a new message through your portfolio contact form.
              </p>

            </td>
          </tr>

          <!-- Contact information -->
          <tr>
            <td
              style="
                padding:30px 36px 10px 36px;
              "
            >

              <!-- Name -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="
                  width:100%;
                  border-bottom:1px solid #232f47;
                "
              >
                <tr>
                  <td
                    width="34%"
                    valign="top"
                    style="
                      padding:0 12px 20px 0;
                      font-family:'Courier New',Courier,monospace;
                      font-size:11px;
                      line-height:18px;
                      font-weight:bold;
                      letter-spacing:1px;
                      text-transform:uppercase;
                      color:#8b96aa;
                    "
                  >
                    NAME
                  </td>

                  <td
                    width="66%"
                    valign="top"
                    style="
                      padding:0 0 20px 0;
                      font-size:15px;
                      line-height:22px;
                      font-weight:600;
                      color:#e8eaed;
                      word-break:break-word;
                    "
                  >
                    ${safeName}
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="
                  width:100%;
                  border-bottom:1px solid #232f47;
                "
              >
                <tr>
                  <td
                    width="34%"
                    valign="top"
                    style="
                      padding:20px 12px 20px 0;
                      font-family:'Courier New',Courier,monospace;
                      font-size:11px;
                      line-height:18px;
                      font-weight:bold;
                      letter-spacing:1px;
                      text-transform:uppercase;
                      color:#8b96aa;
                    "
                  >
                    EMAIL
                  </td>

                  <td
                    width="66%"
                    valign="top"
                    style="
                      padding:20px 0;
                      font-size:15px;
                      line-height:22px;
                      color:#10b981;
                      word-break:break-word;
                    "
                  >
                    
                      <a href="mailto:${safeEmail}"
                      style="
                        color:#10b981;
                        text-decoration:none;
                      "
                    >
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Project message -->
          <tr>
            <td
              style="
                padding:20px 36px 34px 36px;
              "
            >

              <div
                style="
                  margin:0 0 12px 0;
                  font-family:'Courier New',Courier,monospace;
                  font-size:11px;
                  line-height:18px;
                  font-weight:bold;
                  letter-spacing:1px;
                  text-transform:uppercase;
                  color:#8b96aa;
                "
              >
                PROJECT DETAILS
              </div>

              <!-- Message card -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="
                  width:100%;
                  background-color:#0b1120;
                  border:1px solid #232f47;
                  border-radius:10px;
                "
              >
                <tr>
                  <td
                    style="
                      padding:22px;
                      font-size:15px;
                      line-height:26px;
                      color:#e8eaed;
                      word-break:break-word;
                    "
                  >
                    ${safeProject}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- CTA / Reply section -->
          <tr>
            <td
              style="
                padding:26px 36px;
                background-color:#10192a;
                border-top:1px solid #232f47;
              "
            >

              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
              >
                <tr>

                  <td
                    valign="middle"
                    style="
                      padding-right:16px;
                    "
                  >
                    <div
                      style="
                        font-size:14px;
                        line-height:21px;
                        font-weight:600;
                        color:#e8eaed;
                      "
                    >
                      Ready to respond?
                    </div>

                    <div
                      style="
                        margin-top:4px;
                        font-size:12px;
                        line-height:19px;
                        color:#8b96aa;
                      "
                    >
                      Reply directly to this email to contact ${safeName}.
                    </div>
                  </td>

                  <td
                    width="120"
                    valign="middle"
                    align="right"
                  >
                    <a
                      href="mailto:${safeEmail}"
                      style="
                        display:inline-block;
                        padding:11px 18px;
                        background-color:#10b981;
                        border:1px solid #10b981;
                        border-radius:7px;
                        color:#07140f;
                        font-size:13px;
                        line-height:18px;
                        font-weight:700;
                        text-decoration:none;
                        white-space:nowrap;
                      "
                    >
                      Reply
                    </a>
                  </td>

                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding:22px 36px 26px 36px;
                border-top:1px solid #232f47;
              "
            >

              <p
                style="
                  margin:0;
                  padding:0;
                  font-family:'Courier New',Courier,monospace;
                  font-size:10px;
                  line-height:16px;
                  letter-spacing:0.8px;
                  color:#59657a;
                "
              >
                AUTOMATED NOTIFICATION
              </p>

              <p
                style="
                  margin:7px 0 0 0;
                  padding:0;
                  font-size:11px;
                  line-height:17px;
                  color:#59657a;
                "
              >
                Sent from your portfolio contact form
              </p>

            </td>
          </tr>

        </table>

        <!-- Bottom spacing / branding -->
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="
            width:100%;
            max-width:620px;
          "
        >
          <tr>
            <td
              align="center"
              style="
                padding:18px 20px 0 20px;
                font-size:11px;
                line-height:17px;
                color:#4f5b70;
              "
            >
              Portfolio contact notification
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to send email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong while sending your message.",
    });
  }
}
