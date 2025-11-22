#!/bin/bash

echo "🔨 Building MyKard for production..."

# Set environment variables
export NODE_ENV=production
export TURBOPACK=0

# Generate Prisma client
echo "📊 Generating Prisma client..."
npx prisma generate

# Build with webpack
echo "🏗️ Building with webpack..."
npx next build --webpack

echo "✅ Build complete!"
