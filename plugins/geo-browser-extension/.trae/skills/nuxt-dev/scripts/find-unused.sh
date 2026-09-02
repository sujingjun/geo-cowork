#!/bin/bash
set -e

echo "=================================================="
echo "  Unused Code Detection"
echo "=================================================="
echo ""

# 检测项目类型
if [ -f "package.json" ]; then
  PROJECT_TYPE="node"
elif [ -f "requirements.txt" ]; then
  PROJECT_TYPE="python"
else
  PROJECT_TYPE="unknown"
fi

echo "Detected project type: $PROJECT_TYPE"
echo ""

# Node.js 项目未使用代码检测
if [ "$PROJECT_TYPE" = "node" ]; then
  echo "=== Unused Dependencies Check ==="
  echo ""
  
  if command -v npx >/dev/null 2>&1; then
    echo "Running depcheck..."
    npx depcheck --ignores="@nuxt/*,nuxt,typescript,eslint,vitest,@types/*" 2>/dev/null || {
      echo "ℹ️  depcheck not available"
      echo "   Install: npm install -g depcheck"
    }
  else
    echo "⚠️  npx not found; skipping depcheck"
  fi
  
  echo ""
  echo "=== Unused Exports Check ==="
  echo ""
  
  if command -v npx >/dev/null 2>&1; then
    echo "Running ts-prune (if installed)..."
    npx ts-prune 2>/dev/null || {
      echo "ℹ️  ts-prune not available"
      echo "   Install: npm install -D ts-prune"
    }
  fi
  
  echo ""
  echo "=== Dead Code Check ==="
  echo ""
  
  if command -v npx >/dev/null 2>&1; then
    echo "Checking for unused files..."
    echo "ℹ️  This is a basic check; consider using unimported or knip for deeper analysis"
    
    # 查找可能未使用的 .ts/.vue 文件（排除常见入口点）
    find . -type f \( -name "*.ts" -o -name "*.vue" \) \
      ! -path "*/node_modules/*" \
      ! -path "*/.nuxt/*" \
      ! -path "*/dist/*" \
      ! -path "*/.output/*" \
      ! -path "*/coverage/*" \
      ! -name "*.d.ts" \
      ! -name "app.vue" \
      ! -name "nuxt.config.ts" \
      ! -name "tsconfig.json" \
      2>/dev/null | head -50
  fi
fi

# Python 项目未使用代码检测
if [ "$PROJECT_TYPE" = "python" ]; then
  echo "=== Unused Imports Check ==="
  echo ""
  
  if command -v pylint >/dev/null 2>&1; then
    echo "Running pylint to find unused imports..."
    find . -type f -name "*.py" \
      ! -path "*/venv/*" \
      ! -path "*/.venv/*" \
      ! -path "*/env/*" \
      -exec pylint --disable=all --enable=unused-import {} + 2>/dev/null || {
      echo "ℹ️  pylint check completed with warnings"
    }
  else
    echo "⚠️  pylint not installed"
    echo "   Install: pip install pylint"
  fi
  
  echo ""
  echo "=== Unused Variables Check ==="
  echo ""
  
  if command -v vulture >/dev/null 2>&1; then
    echo "Running vulture to find dead code..."
    vulture . --exclude "venv,.venv,env" || echo "ℹ️  vulture check completed"
  else
    echo "ℹ️  vulture not installed"
    echo "   Install: pip install vulture"
  fi
fi

echo ""
echo "=== Manual Review Suggestions ==="
echo ""
echo "🔍 Areas to review manually:"
echo "   1. Components/modules with no imports"
echo "   2. Functions/classes with no references"
echo "   3. Deprecated code marked with TODO/FIXME"
echo "   4. Test files for deleted features"
echo "   5. Old migration files (after successful deployment)"
echo ""

# 查找 TODO 和 FIXME 注释
echo "=== TODO/FIXME Comments ==="
echo ""
grep -r "TODO\|FIXME" \
  --exclude-dir=node_modules \
  --exclude-dir=.nuxt \
  --exclude-dir=dist \
  --exclude-dir=.output \
  --exclude-dir=coverage \
  --exclude-dir=venv \
  --exclude-dir=.git \
  --include="*.ts" \
  --include="*.vue" \
  --include="*.js" \
  --include="*.py" \
  . 2>/dev/null | head -20 || echo "No TODO/FIXME comments found"

echo ""
echo "=== Unused Code Detection Complete ==="
echo ""
echo "💡 Tips:"
echo "   - Remove unused dependencies to reduce bundle size"
echo "   - Delete dead code to improve maintainability"
echo "   - Review TODO/FIXME comments regularly"
echo "   - Use tree-shaking in production builds"
echo ""
