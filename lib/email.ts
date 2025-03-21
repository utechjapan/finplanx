// lib/email.ts
import nodemailer from 'nodemailer';
import { isDevMode } from './auth';

// Set up mail transporter
const getTransporter = () => {
  // In development, use a testing account
  if (isDevMode()) {
    // For development, log emails to console instead of sending
    return {
      sendMail: async (mailOptions: any) => {
        console.log('--------- DEVELOPMENT EMAIL ---------');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Text:', mailOptions.text);
        console.log('HTML:', mailOptions.html);
        console.log('-------------------------------------');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    };
  }

  // For production
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
};

// Send welcome email when user registers
export async function sendWelcomeEmail(email: string, name: string) {
  const transporter = getTransporter();
  
  const mailOptions = {
    from: `"FinPlanX" <${process.env.EMAIL_FROM || 'noreply@finplanx-app.com'}>`,
    to: email,
    subject: 'FinPlanXへようこそ！',
    text: `
${name}様、

FinPlanXへようこそ！アカウント登録いただきありがとうございます。

あなた専用の財務管理ツールで、資産形成の第一歩を踏み出しましょう。

ご不明な点がございましたら、お気軽にサポートチームまでお問い合わせください。

FinPlanXチーム
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="background-color: #3b82f6; color: white; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">F</div>
    <h1 style="color: #3b82f6; margin-top: 10px;">FinPlanX</h1>
  </div>
  
  <h2 style="color: #333;">FinPlanXへようこそ！</h2>
  
  <p style="color: #666; line-height: 1.6;">
    ${name}様、<br><br>
    FinPlanXへようこそ！アカウント登録いただきありがとうございます。
  </p>
  
  <p style="color: #666; line-height: 1.6;">
    あなた専用の財務管理ツールで、資産形成の第一歩を踏み出しましょう。
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.NEXTAUTH_URL || 'https://finplanx-app.com'}/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ダッシュボードへアクセス</a>
  </div>
  
  <p style="color: #666; line-height: 1.6;">
    ご不明な点がございましたら、お気軽にサポートチームまでお問い合わせください。
  </p>
  
  <p style="color: #666; line-height: 1.6; margin-top: 30px;">
    よろしくお願いいたします。<br>
    FinPlanXチーム
  </p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #999; text-align: center;">
    このメールは自動送信されています。返信はできませんのでご了承ください。<br>
    &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
  </div>
</div>
    `,
  };
  
  return transporter.sendMail(mailOptions);
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const transporter = getTransporter();
  const resetUrl = `${process.env.NEXTAUTH_URL || 'https://finplanx-app.com'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"FinPlanX" <${process.env.EMAIL_FROM || 'noreply@finplanx-app.com'}>`,
    to: email,
    subject: 'FinPlanX - パスワードリセットのご案内',
    text: `
${name}様、

FinPlanXのパスワードリセットのリクエストを受け付けました。

以下のリンクからパスワードをリセットしてください：
${resetUrl}

このリンクは24時間有効です。

このリクエストに心当たりがない場合は、このメールを無視してください。

FinPlanXチーム
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="background-color: #3b82f6; color: white; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">F</div>
    <h1 style="color: #3b82f6; margin-top: 10px;">FinPlanX</h1>
  </div>
  
  <h2 style="color: #333;">パスワードリセットのご案内</h2>
  
  <p style="color: #666; line-height: 1.6;">
    ${name}様、<br><br>
    FinPlanXのパスワードリセットのリクエストを受け付けました。
  </p>
  
  <p style="color: #666; line-height: 1.6;">
    以下のボタンをクリックして、パスワードをリセットしてください。このリンクは24時間有効です。
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">パスワードをリセット</a>
  </div>
  
  <p style="color: #666; line-height: 1.6;">
    上記のボタンが機能しない場合は、以下のURLをブラウザに貼り付けてください：<br>
    <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
  </p>
  
  <p style="color: #666; line-height: 1.6;">
    このリクエストに心当たりがない場合は、このメールを無視してください。
  </p>
  
  <p style="color: #666; line-height: 1.6; margin-top: 30px;">
    よろしくお願いいたします。<br>
    FinPlanXチーム
  </p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #999; text-align: center;">
    このメールは自動送信されています。返信はできませんのでご了承ください。<br>
    &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
  </div>
</div>
    `,
  };
  
  return transporter.sendMail(mailOptions);
}

// Send login notification email
export async function sendLoginNotificationEmail(email: string, name: string) {
  const transporter = getTransporter();
  const loginTime = new Date().toLocaleString('ja-JP');
  
  const mailOptions = {
    from: `"FinPlanX" <${process.env.EMAIL_FROM || 'noreply@finplanx-app.com'}>`,
    to: email,
    subject: 'FinPlanX - ログイン通知',
    text: `
${name}様、

あなたのFinPlanXアカウントに新しいログインがありました。

日時: ${loginTime}

このログインに心当たりがない場合は、すぐにパスワードを変更し、サポートチームにご連絡ください。

FinPlanXチーム
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="background-color: #3b82f6; color: white; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">F</div>
    <h1 style="color: #3b82f6; margin-top: 10px;">FinPlanX</h1>
  </div>
  
  <h2 style="color: #333;">ログイン通知</h2>
  
  <p style="color: #666; line-height: 1.6;">
    ${name}様、<br><br>
    あなたのFinPlanXアカウントに新しいログインがありました。
  </p>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0; color: #333;"><strong>日時:</strong> ${loginTime}</p>
  </div>
  
  <p style="color: #666; line-height: 1.6;">
    このログインに心当たりがない場合は、すぐにパスワードを変更し、サポートチームにご連絡ください。
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.NEXTAUTH_URL || 'https://finplanx-app.com'}/settings" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">アカウント設定へアクセス</a>
  </div>
  <p style="color: #666; line-height: 1.6; margin-top: 30px;">
    よろしくお願いいたします。<br>
    FinPlanXチーム
  </p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #999; text-align: center;">
    このメールは自動送信されています。返信はできませんのでご了承ください。<br>
    &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
  </div>
</div>
    `,
  };
  
  return transporter.sendMail(mailOptions);
}

// Send contact form email
export async function sendContactFormEmail(senderEmail: string, senderName: string, subject: string, message: string) {
  const transporter = getTransporter();
  
  const mailOptions = {
    from: `"FinPlanX Contact Form" <${process.env.EMAIL_FROM || 'noreply@finplanx-app.com'}>`,
    to: process.env.CONTACT_EMAIL || 'contact@finplanx-app.com',
    subject: `[お問い合わせ] ${subject}`,
    text: `
新しいお問い合わせが届きました。

名前: ${senderName}
メールアドレス: ${senderEmail}
件名: ${subject}

メッセージ:
${message}
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="background-color: #3b82f6; color: white; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">F</div>
    <h1 style="color: #3b82f6; margin-top: 10px;">FinPlanX</h1>
  </div>
  
  <h2 style="color: #333;">新しいお問い合わせ</h2>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 5px 0; color: #333;"><strong>名前:</strong> ${senderName}</p>
    <p style="margin: 5px 0; color: #333;"><strong>メールアドレス:</strong> ${senderEmail}</p>
    <p style="margin: 5px 0; color: #333;"><strong>件名:</strong> ${subject}</p>
  </div>
  
  <div style="margin-top: 20px;">
    <h3 style="color: #333;">メッセージ:</h3>
    <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #999; text-align: center;">
    このメールはFinPlanXのお問い合わせフォームから自動送信されています。<br>
    &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
  </div>
</div>
    `,
  };
  
  // Also send confirmation to the sender
  const confirmationMailOptions = {
    from: `"FinPlanX" <${process.env.EMAIL_FROM || 'noreply@finplanx-app.com'}>`,
    to: senderEmail,
    subject: 'FinPlanX - お問い合わせありがとうございます',
    text: `
${senderName}様、

FinPlanXへのお問い合わせありがとうございます。

件名: ${subject}

メッセージ:
${message}

担当者が確認次第、ご連絡いたします。

FinPlanXチーム
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="background-color: #3b82f6; color: white; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">F</div>
    <h1 style="color: #3b82f6; margin-top: 10px;">FinPlanX</h1>
  </div>
  
  <h2 style="color: #333;">お問い合わせありがとうございます</h2>
  
  <p style="color: #666; line-height: 1.6;">
    ${senderName}様、<br><br>
    FinPlanXへのお問い合わせありがとうございます。担当者が確認次第、ご連絡いたします。
  </p>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 5px 0; color: #333;"><strong>件名:</strong> ${subject}</p>
  </div>
  
  <div style="margin-top: 20px;">
    <h3 style="color: #333;">お送りいただいたメッセージ:</h3>
    <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
  </div>
  
  <p style="color: #666; line-height: 1.6; margin-top: 30px;">
    よろしくお願いいたします。<br>
    FinPlanXチーム
  </p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #999; text-align: center;">
    このメールは自動送信されています。返信はできませんのでご了承ください。<br>
    &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
  </div>
</div>
    `,
  };
  
  // Send both emails
  await transporter.sendMail(mailOptions);
  return transporter.sendMail(confirmationMailOptions);
}