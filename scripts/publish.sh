#!/bin/zsh
cd packages/api
npm version patch
npm run publish:pkg

cd ../embed-react
npm version patch
## change "@reviewsup/api": "workspace:*" to "@reviewsup/api": "latest"
npm run publish:pkg
