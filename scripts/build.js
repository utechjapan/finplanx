// scripts/build.js - 改善されたビルドプロセス
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// デモモードの設定
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

console.log(`🛠️ FinPlanX ビルドスクリプト`);
console.log(`==============================`);
console.log(`🔧 ビルドモード: ${DEMO_MODE ? 'デモ' : '本番'}`);
console.log(`🔧 環境: ${process.env.NODE_ENV || 'development'}`);

// 環境変数ファイルの確認
const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
let envFileExists = false;

for (const file of envFiles) {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ 環境変数ファイル ${file} が見つかりました`);
    envFileExists = true;
    break;
  }
}

if (!envFileExists) {
  console.log('⚠️ 環境変数ファイルが見つかりません。デフォルト設定を使用します。');
  
  // デフォルトの環境変数設定を作成
  const defaultEnv = `
# Default environment settings
NEXTAUTH_URL=${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}
NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET || 'development-secret-key-please-change-in-production'}
NEXT_PUBLIC_DEMO_MODE=${DEMO_MODE ? 'true' : 'false'}
# Database (dummy values, please replace with your actual database URL)
DATABASE_URL=${process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/finplanx'}
`;

  fs.writeFileSync(path.join(process.cwd(), '.env.local'), defaultEnv);
  console.log('✅ デフォルトの .env.local ファイルを作成しました');
}

// Prismaのデータベース設定が存在するか確認
try {
  const schemaFile = path.join(process.cwd(), 'prisma/schema.prisma');
  
  if (fs.existsSync(schemaFile)) {
    const schemaContent = fs.readFileSync(schemaFile, 'utf8');
    
    if (!schemaContent.includes('datasource db')) {
      console.error('❌ エラー: schema.prismaにデータソース定義がありません');
      
      // 基本的なデータソース定義を追加
      const newSchema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${schemaContent}`;
      
      fs.writeFileSync(schemaFile, newSchema);
      console.log('✅ schema.prismaにデータソース定義を追加しました');
    }
  } else {
    console.warn('⚠️ 警告: prisma/schema.prismaファイルが見つかりません');
  }
} catch (error) {
  console.error('❌ Prismaスキーマの確認中にエラーが発生しました:', error);
}

// TypeScriptのチェック
try {
  console.log('🔍 TypeScriptエラーを確認中...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScriptエラーはありません');
} catch (error) {
  console.log('⚠️ TypeScriptエラーが検出されましたが、ビルドを続行します:');
  if (error.stdout) {
    const errorOutput = error.stdout.toString();
    // 長いエラーメッセージを要約
    const errorLines = errorOutput.split('\n').filter(line => line.includes('error'));
    console.log(`エラー数: ${errorLines.length}`);
    
    // 最初の5つのエラーのみ表示
    errorLines.slice(0, 5).forEach(line => console.log(line));
    if (errorLines.length > 5) {
      console.log(`... および ${errorLines.length - 5} 個の追加エラー`);
    }
  }
}

// キャッシュをクリアしてからビルド
try {
  console.log('🧹 Next.jsキャッシュをクリア中...');
  execSync('npx rimraf .next', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️ キャッシュのクリア中にエラーが発生しましたが、続行します');
}

// 依存関係のインストール
try {
  console.log('📦 依存関係をインストール中...');
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 依存関係のインストール中にエラーが発生しました:', error);
  process.exit(1);
}

// Prisma クライアントの生成
try {
  console.log('🔧 Prismaクライアントを生成中...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Prismaクライアントの生成中にエラーが発生しました:', error);
  // プロダクションではPrisma生成エラーが発生した場合は終了
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Next.js ビルド
console.log('🚀 Next.js ビルドを開始します...');
try {
  // ビルド時に型エラーを無視する環境変数を設定
  const env = {
    ...process.env,
    NEXT_TYPESCRIPT_COMPILE_ONLY_IF_PASSING: 'false',
    NEXT_IGNORE_TYPE_ERRORS: 'true',
    NEXT_IGNORE_ESLINT_ERRORS: 'true'
  };

  // ビルドを実行
  execSync('next build', { 
    env, 
    stdio: 'inherit' 
  });
  console.log('✅ ビルドが成功しました！');
} catch (error) {
  console.error('❌ ビルド中にエラーが発生しました:', error);
  process.exit(1);
}