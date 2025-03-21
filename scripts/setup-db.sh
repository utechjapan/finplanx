#!/bin/bash
# FinPlanX データベースセットアップスクリプト

# 色の設定
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}FinPlanX データベースセットアップスクリプト${NC}"
echo "======================================"

# 環境変数の読み込み
if [ -f .env ]; then
  echo -e "${GREEN}環境変数を.envから読み込みます${NC}"
  source .env
elif [ -f .env.local ]; then
  echo -e "${GREEN}環境変数を.env.localから読み込みます${NC}"
  source .env.local
else
  echo -e "${RED}エラー: .envまたは.env.localファイルが見つかりません${NC}"
  echo "サンプル設定ファイルをコピーして、データベース情報を設定してください:"
  echo "cp .env.example .env.local"
  exit 1
fi

# DATABASE_URLが設定されているか確認
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}エラー: DATABASE_URLが設定されていません${NC}"
  echo "環境変数ファイルに有効なDATABASE_URLを設定してください"
  exit 1
fi

echo -e "${GREEN}Prismaのセットアップを開始します...${NC}"

# Prisma生成
echo "Prismaクライアントを生成しています..."
npx prisma generate

# データベースマイグレーション
echo "データベースマイグレーションを実行しています..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
  echo -e "${GREEN}データベースのセットアップが完了しました!${NC}"
  echo "以下のコマンドでアプリケーションを起動できます:"
  echo "npm run dev"
else
  echo -e "${RED}マイグレーション中にエラーが発生しました${NC}"
  echo "エラーを修正してから再度実行してください"
  exit 1
fi

# シードデータ（オプション）
read -p "デモデータをデータベースに追加しますか? (y/n): " answer
if [[ $answer == [Yy]* ]]; then
  echo "シードデータを追加しています..."
  npx prisma db seed
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}シードデータが正常に追加されました${NC}"
  else
    echo -e "${RED}シードデータの追加中にエラーが発生しました${NC}"
  fi
fi

echo -e "${YELLOW}=====================================${NC}"
echo -e "${GREEN}FinPlanX データベースの準備が完了しました${NC}"
echo -e "${YELLOW}=====================================${NC}"