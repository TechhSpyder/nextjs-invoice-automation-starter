#!/bin/bash

# PDFBridge Starter Setup Script
# Frictionless onboarding for developers

echo "🚀 Starting PDFBridge Starter Setup..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Setup Environment Variables
if [ ! -f .env.local ]; then
  echo "📄 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Action Required: Update PDFBRIDGE_API_KEY in .env.local"
else
  echo "✅ .env.local already exists."
fi

# 3. Validation
echo "🔍 Validating environment..."
if grep -q "pk_live_your_key_here" .env.local; then
  echo "❌ Error: You haven't set your PDFBRIDGE_API_KEY yet."
  echo "Get one for free at https://pdfbridge.xyz"
else
  echo "✅ Environment looks good."
fi

echo "✨ Setup complete! Run 'npm run dev' to start."
