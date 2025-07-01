#!/bin/zsh
echo "Running gpg-env.sh script..."
gpg --symmetric --cipher-algo AES256 .env.production
