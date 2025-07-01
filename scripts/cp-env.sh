#!/bin/zsh
echo "Running cp-env.sh script..."
for pkg in apps/api apps/landing apps/web packages/database; do
  cp .env "$pkg/.env"
done
