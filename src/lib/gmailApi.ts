import nodemailer from 'nodemailer';

type SendMailParams = {
  subject: string;
  text: string;
};

export async function sendGmail({ subject, text }: SendMailParams) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.GMAIL_TO;
  if (!user || !pass || !to) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
}
