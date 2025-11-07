#!/bin/bash
echo "🔍 Running Snyk Security Scan..."

if ! command -v snyk >/dev/null 2>&1; then
  echo "Installing snyk..."
  npm install -g snyk
fi

if [ -d backend ]; then
  cd backend
  echo "Scanning backend..."
  snyk test --severity-threshold=high || true
  cd ..
fi

if [ -d frontend ]; then
  cd frontend
  echo "Scanning frontend..."
  snyk test --severity-threshold=high || true
  cd ..
fi
