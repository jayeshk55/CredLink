#!/bin/bash

echo "🔨 Building MyKard for production..."

# Set environment variables
export NODE_ENV=production
export TURBOPACK=1

# Generate Prisma client
echo "📊 Generating Prisma client..."
npx prisma generate

# Build for production
echo "🏗️ Building for production..."
npx next build

echo "✅ Build complete!"