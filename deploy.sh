#!/bin/bash

echo "🚀 배포 시작..."

# 빌드
echo "📦 프로젝트 빌드 중..."
npm run build

# Git에 변경사항 커밋
echo "💾 변경사항 커밋 중..."
git add .
git commit -m "Auto deploy: $(date)"

# GitHub에 푸시
echo "📤 GitHub에 푸시 중..."
git push origin main

echo "✅ 배포 완료! Vercel에서 자동 배포를 확인하세요."
echo "🌐 Vercel 대시보드: https://vercel.com/dashboard"


