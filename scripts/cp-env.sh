#!/bin/zsh
echo "Running cp-env.sh script..."
for pkg in apps/api apps/web packages/database packages/api; do
  cp .env "$pkg/.env"
done
