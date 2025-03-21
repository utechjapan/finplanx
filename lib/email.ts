// File: lib/email.ts
// Updated email system with better error handling and retry logic

import nodemailer from 'nodemailer';
import { isDevMode } from './auth';
import { setTimeout } from 'timers/promises';

// Maximum number of email sending retries
const MAX_RETRIES = 3;

// Set up mail transporter with retry capability
const getTransporter = () => {
  if (isDevMode()) {
    return {
      sendMail: async (mailOptions: any) => {
        console.log('--------- DEVELOPMENT EMAIL ---------');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Text:', mailOptions.text);
        console.log('HTML:', mailOptions.html ? 'HTML email content (truncated)' : 'No HTML');
        console.log('-------------------------------------');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    };
  }
  
  // Real email transporter for production
  try {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER || '',
        pass: process.env.EMAIL_SERVER_PASSWORD || '',
      },
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    
    // Return a mock transporter as fallback
    return {
      sendMail: async (mailOptions: any) => {
        console.error('Email sending failed - transporter error. Would have sent:', {
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        return { messageId: 'error-fallback-' + Date.now() };
      }
    };
  }
};

// Helper function to send email with retry logic
async function sendEmailWithRetry(mailOptions: any, retryCount = 0) {
  const transporter = getTransporter();
  
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.error(`Email sending failed, attempt ${retryCount + 1} of ${MAX_RETRIES}:`, error);
      // Exponential backoff
      const delay = 1000 * Math.pow(2, retryCount);
      await setTimeout(delay);
      return sendEmailWithRetry(mailOptions, retryCount + 1);
    } else {
      console.error(`Email sending failed after ${MAX_RETRIES} attempts:`, error);
      throw error;
    }
  }
}

// Get site URL from environment or use default
const getSiteUrl = () => {
  return process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://finplanx-app.com';
};

// Get sender email address
const getSenderEmail = () => {
  return process.env.EMAIL_FROM || 'noreply@finplanx-app.com';
};

export async function sendWelcomeEmail(email: string, name: string) {
  const siteUrl = getSiteUrl();
  const loginUrl = `${siteUrl}/login`;
  
  const mailOptions = {
    from: `"FinPlanX" <${getSenderEmail()}>`,
    to: email,
    subject: 'FinPlanXへようこそ！',
    text: `
${name}様、

FinPlanXへようこそ！アカウント登録いただきありがとうございます。

あなた専用の財務管理ツールで、資産形成の第一歩を踏み出しましょう。

ログインはこちら: ${loginUrl}

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
    <a href="${loginUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ダッシュボードへアクセス</a>
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
  
  return sendEmailWithRetry(mailOptions);
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const siteUrl = getSiteUrl();
  const resetUrl = `${siteUrl}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"FinPlanX" <${getSenderEmail()}>`,
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
  
  return sendEmailWithRetry(mailOptions);
}

export async function sendLoginNotificationEmail(email: string, name: string) {
  const siteUrl = getSiteUrl();
  const settingsUrl = `${siteUrl}/settings`;
  const loginTime = new Date().toLocaleString('ja-JP');
  
  const mailOptions = {
    from: `"FinPlanX" <${getSenderEmail()}>`,
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
    <a href="${settingsUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">アカウント設定へアクセス</a>
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
  
  return sendEmailWithRetry(mailOptions);
}

export async function sendContactFormEmail(senderEmail: string, senderName: string, subject: string, message: string) {
  // Support email is either from env or default
  const supportEmail = process.env.CONTACT_EMAIL || 'contact@finplanx-app.com';
  
  const mailOptions = {
    from: `"FinPlanX Contact Form" <${getSenderEmail()}>`,
    to: supportEmail,
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

  // Send confirmation email to user
  const confirmationMailOptions = {
    from: `"FinPlanX" <${getSenderEmail()}>`,
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

  try {
    // Send to support team
    await sendEmailWithRetry(mailOptions);
    // Send confirmation to user
    return sendEmailWithRetry(confirmationMailOptions);
  } catch (error) {
    console.error('Failed to send contact emails:', error);
    // Try to at least send the confirmation email
    try {
      return sendEmailWithRetry(confirmationMailOptions);
    } catch (confirmError) {
      console.error('Failed to send confirmation email:', confirmError);
      throw error; // Re-throw the original error
    }
  }
}

export async function sendEmailVerificationEmail(email: string, name: string, token: string) {
  const siteUrl = getSiteUrl();
  const verificationUrl = `${siteUrl}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"FinPlanX" <${getSenderEmail()}>`,
    to: email,
    subject: 'FinPlanX - メールアドレスの確認',
    text: `
${name}様、

FinPlanXへのユーザー登録ありがとうございます。
以下のリンクをクリックして、メールアドレスを確認してください：

${verificationUrl}

このリンクは24時間有効です。

このメールに心当たりがない場合は、無視してください。

FinPlanXチーム
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="background-color: #3b82f6; color: white; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">F</div>
    <h1 style="color: #3b82f6; margin-top: 10px;">FinPlanX</h1>
  </div>
  <h2 style="color: #333;">メールアドレスの確認</h2>
  <p style="color: #666; line-height: 1.6;">
    ${name}様、<br><br>
    FinPlanXへのユーザー登録ありがとうございます。
  </p>
  <p style="color: #666; line-height: 1.6;">
    以下のボタンをクリックして、メールアドレスを確認してください。このリンクは24時間有効です。
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">メールアドレスを確認</a>
  </div>
  <p style="color: #666; line-height: 1.6;">
    上記のボタンが機能しない場合は、以下のURLをブラウザに貼り付けてください：<br>
    <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
  </p>
  <p style="color: #666; line-height: 1.6;">
    このメールに心当たりがない場合は、このメールを無視してください。
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
  
  return sendEmailWithRetry(mailOptions);
}

// New - Send reminder email for expenses
export async function sendExpenseReminderEmail(email: string, name: string, expenseName: string, amount: number, dueDate: Date) {
  const formattedAmount = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  const formattedDate = new Intl.DateTimeFormat('ja-JP', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }).format(dueDate);
  
  const mailOptions = {
    from: `"FinPlanX" <${getSenderEmail()}>`,
    to: email,
    subject: `FinPlanX - ${expenseName}の支払い期限が近づいています`,
    text: `
${name}様、

${expenseName}の支払い期限が近づいています。

金額: ${formattedAmount}
期限: ${formattedDate}

FinPlanXチーム
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="background-color: #3b82f6; color: white; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px;">F</div>
    <h1 style="color: #3b82f6; margin-top: 10px;">FinPlanX</h1>
  </div>
  
  <h2 style="color: #333;">支払いリマインダー</h2>
  
  <p style="color: #666; line-height: 1.6;">
    ${name}様、<br><br>
    ${expenseName}の支払い期限が近づいています。
  </p>
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 5px 0; color: #333;"><strong>支払い名:</strong> ${expenseName}</p>
    <p style="margin: 5px 0; color: #333;"><strong>金額:</strong> ${formattedAmount}</p>
    <p style="margin: 5px 0; color: #333;"><strong>期限:</strong> ${formattedDate}</p>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${getSiteUrl()}/finances" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">収支管理を開く</a>
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
  
  return sendEmailWithRetry(mailOptions);
}