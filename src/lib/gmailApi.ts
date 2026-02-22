import nodemailer from 'nodemailer';

type SendMailParams = {
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendGmail({ subject, text, replyTo }: SendMailParams) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const rawTo = process.env.GMAIL_TO;
  if (!user || !pass || !rawTo) return;

  const to = rawTo.endsWith('@gmail.com')
    ? rawTo.replace('@gmail.com', '+contact@gmail.com')
    : rawTo;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: user,
    to,
    replyTo,
    subject,
    text,
  });
}
