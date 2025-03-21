// lib/email-templates.ts
// Email templates for various notifications and communications

export const welcomeEmailTemplate = (name: string, loginUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to FinPlanX</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-radius: 5px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      background-color: #3b82f6;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 24px;
      margin: 0 auto;
    }
    .logo-text {
      color: #3b82f6;
      margin-top: 10px;
    }
    h1, h2 {
      color: #333;
    }
    .content {
      color: #666;
      line-height: 1.6;
    }
    .button {
      background-color: #3b82f6;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eaeaea;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">F</div>
      <h1 class="logo-text">FinPlanX</h1>
    </div>
    
    <h2>FinPlanXへようこそ！</h2>
    
    <div class="content">
      <p>${name}様、</p>
      <p>FinPlanXへようこそ！アカウント登録いただきありがとうございます。</p>
      <p>あなた専用の財務管理ツールで、資産形成の第一歩を踏み出しましょう。</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" class="button">ダッシュボードへアクセス</a>
    </div>
    
    <div class="content">
      <p>ご不明な点がございましたら、お気軽にサポートチームまでお問い合わせください。</p>
      <p>よろしくお願いいたします。<br>FinPlanXチーム</p>
    </div>
    
    <div class="footer">
      このメールは自動送信されています。返信はできませんのでご了承ください。<br>
      &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const passwordResetEmailTemplate = (name: string, resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - FinPlanX</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-radius: 5px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      background-color: #3b82f6;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 24px;
      margin: 0 auto;
    }
    .logo-text {
      color: #3b82f6;
      margin-top: 10px;
    }
    h1, h2 {
      color: #333;
    }
    .content {
      color: #666;
      line-height: 1.6;
    }
    .button {
      background-color: #3b82f6;
      color: white !important;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
    }
    .note {
      margin-top: 20px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 5px;
      font-size: 0.9em;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eaeaea;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">F</div>
      <h1 class="logo-text">FinPlanX</h1>
    </div>
    
    <h2>パスワードリセットのご案内</h2>
    
    <div class="content">
      <p>${name}様、</p>
      <p>FinPlanXのパスワードリセットのリクエストを受け付けました。</p>
      <p>以下のボタンをクリックして、パスワードをリセットしてください。このリンクは24時間有効です。</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button">パスワードをリセット</a>
    </div>
    
    <div class="note">
      <p>上記のボタンが機能しない場合は、以下のURLをブラウザに貼り付けてください：</p>
      <p><a href="${resetUrl}" style="word-break: break-all;">${resetUrl}</a></p>
    </div>
    
    <div class="content">
      <p>このリクエストに心当たりがない場合は、このメールを無視してください。</p>
      <p>よろしくお願いいたします。<br>FinPlanXチーム</p>
    </div>
    
    <div class="footer">
      このメールは自動送信されています。返信はできませんのでご了承ください。<br>
      &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const loginNotificationEmailTemplate = (name: string, loginTime: string, settingsUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Notification - FinPlanX</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-radius: 5px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      background-color: #3b82f6;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 24px;
      margin: 0 auto;
    }
    .logo-text {
      color: #3b82f6;
      margin-top: 10px;
    }
    h1, h2 {
      color: #333;
    }
    .content {
      color: #666;
      line-height: 1.6;
    }
    .alert-box {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .button {
      background-color: #3b82f6;
      color: white !important;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eaeaea;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">F</div>
      <h1 class="logo-text">FinPlanX</h1>
    </div>
    
    <h2>ログイン通知</h2>
    
    <div class="content">
      <p>${name}様、</p>
      <p>あなたのFinPlanXアカウントに新しいログインがありました。</p>
    </div>
    
    <div class="alert-box">
      <p><strong>日時:</strong> ${loginTime}</p>
    </div>
    
    <div class="content">
      <p>このログインに心当たりがない場合は、すぐにパスワードを変更し、サポートチームにご連絡ください。</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${settingsUrl}" class="button">アカウント設定へアクセス</a>
    </div>
    
    <div class="content">
      <p>よろしくお願いいたします。</p>
      <p>FinPlanXチーム</p>
    </div>
    
    <div class="footer">
      このメールは自動送信されています。返信はできませんのでご了承ください。<br>
      &copy; ${new Date().getFullYear()} FinPlanX. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
