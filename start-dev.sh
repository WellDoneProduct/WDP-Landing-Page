#!/bin/bash
cd /Users/chad/Downloads/wdp-next
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
exec npm run dev -- --webpack
