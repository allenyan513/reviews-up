#!/bin/zsh
for pkg in apps/* packages/*; do
  rm -rf "$pkg/node_modules" "$pkg/.turbo" "$pkg/.next" "$pkg/dist"
done

rm -rf node_modules .turbo .next dist
