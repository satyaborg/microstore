#!/bin/bash

# Exit on error
set -e

echo "🚀 Running database migrations..."

# Generate migrations
echo "📝 Generating migrations..."
if ! npx drizzle-kit generate; then
  echo "❌ Failed to generate migrations"
  exit 1
fi

# Run migrations
echo "🔄 Running migrations..."
if ! npx drizzle-kit migrate; then
  echo "❌ Failed to run migrations"
  exit 1
fi

echo "✅ Migrations completed successfully!"
