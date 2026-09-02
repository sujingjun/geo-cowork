#!/bin/bash
set -e

echo "=================================================="
echo "  Project Dependency Analysis"
echo "=================================================="
echo ""

# 检测项目类型
if [ -f "package.json" ]; then
  PROJECT_TYPE="node"
elif [ -f "requirements.txt" ]; then
  PROJECT_TYPE="python"
elif [ -f "go.mod" ]; then
  PROJECT_TYPE="go"
else
  PROJECT_TYPE="unknown"
fi

echo "Detected project type: $PROJECT_TYPE"
echo ""

# Node.js 项目分析
if [ "$PROJECT_TYPE" = "node" ]; then
  echo "=== Node.js Dependencies ==="
  echo ""
  
  if command -v pnpm >/dev/null 2>&1; then
    echo "Using pnpm..."
    pnpm list --depth=0 2>/dev/null || echo "No dependencies found or not installed"
  elif command -v npm >/dev/null 2>&1; then
    echo "Using npm..."
    npm ls --depth=0 2>/dev/null || echo "No dependencies found or not installed"
  else
    echo "⚠️  Neither pnpm nor npm found"
  fi
  
  echo ""
  echo "=== Circular Dependency Check ==="
  echo ""
  
  if command -v npx >/dev/null 2>&1; then
    echo "Running madge analysis..."
    npx madge --circular --extensions ts,tsx,js,jsx,vue . 2>/dev/null || {
      echo "ℹ️  madge not available or no circular dependencies found"
      echo "   Install: npm install -g madge"
    }
  else
    echo "⚠️  npx not found; skipping circular dependency check"
  fi
  
  echo ""
  echo "=== Dependency Graph (Top-Level) ==="
  echo ""
  
  if [ -f "pnpm-lock.yaml" ]; then
    echo "Analyzing pnpm-lock.yaml..."
    grep -E '^\s{2}[^:]+:' pnpm-lock.yaml | head -20 || echo "Unable to parse lock file"
  elif [ -f "package-lock.json" ]; then
    echo "Analyzing package-lock.json..."
    node -e "const pkg = require('./package-lock.json'); console.log(Object.keys(pkg.dependencies || {}).slice(0, 20).join('\n'))" 2>/dev/null || echo "Unable to parse lock file"
  fi
fi

# Python 项目分析
if [ "$PROJECT_TYPE" = "python" ]; then
  echo "=== Python Dependencies ==="
  echo ""
  
  if command -v pip >/dev/null 2>&1; then
    pip list || echo "No dependencies found"
  else
    echo "⚠️  pip not found"
  fi
  
  echo ""
  echo "=== Circular Dependency Check ==="
  echo ""
  
  if command -v pipdeptree >/dev/null 2>&1; then
    pipdeptree --warn circular || echo "No circular dependencies found"
  else
    echo "ℹ️  pipdeptree not installed"
    echo "   Install: pip install pipdeptree"
  fi
fi

# Go 项目分析
if [ "$PROJECT_TYPE" = "go" ]; then
  echo "=== Go Dependencies ==="
  echo ""
  
  if command -v go >/dev/null 2>&1; then
    go list -m all || echo "No dependencies found"
  else
    echo "⚠️  go not found"
  fi
fi

echo ""
echo "=== Dependency Statistics ==="
echo ""

if [ -f "package.json" ]; then
  PROD_DEPS=$(node -e "const pkg = require('./package.json'); console.log(Object.keys(pkg.dependencies || {}).length)" 2>/dev/null || echo "0")
  DEV_DEPS=$(node -e "const pkg = require('./package.json'); console.log(Object.keys(pkg.devDependencies || {}).length)" 2>/dev/null || echo "0")
  echo "Production dependencies: $PROD_DEPS"
  echo "Development dependencies: $DEV_DEPS"
  echo "Total: $((PROD_DEPS + DEV_DEPS))"
elif [ -f "requirements.txt" ]; then
  TOTAL_DEPS=$(grep -c '^[^#]' requirements.txt 2>/dev/null || echo "0")
  echo "Total Python dependencies: $TOTAL_DEPS"
fi

echo ""
echo "=== Module Analysis Complete ==="
echo ""
echo "💡 Tips:"
echo "   - Review circular dependencies carefully"
echo "   - Consider removing unused dependencies"
echo "   - Keep dependencies up-to-date (use renovate/dependabot)"
echo ""
