import nodemailer from 'nodemailer';

export function isMailConfigured() {
  return Boolean(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
}

function createTransport() {
  const port = Number(process.env.EMAIL_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export const mailer = {
  async send({ to, subject, text, html }) {
    if (!isMailConfigured()) {
      throw new Error('Email is not configured');
    }

    const transporter = createTransport();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });
  }
};
