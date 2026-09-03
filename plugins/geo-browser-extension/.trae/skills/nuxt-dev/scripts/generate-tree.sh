#!/bin/bash
set -e

OUTPUT_DIR=".dhcoder/skills/nuxt-dev/assets"
mkdir -p "$OUTPUT_DIR"

echo "=================================================="
echo "  Directory Tree Generator"
echo "=================================================="
echo ""
echo "Output directory: $OUTPUT_DIR"
echo ""

# 检测 tree 命令
if command -v tree >/dev/null 2>&1; then
  echo "Using 'tree' command..."
  
  # 生成完整目录树（4层深度）
  echo "Generating directory tree (depth: 4)..."
  tree -L 4 -I 'node_modules|dist|build|coverage|venv|__pycache__|.git|.nuxt|.output|pnpm-lock.yaml' \
    > "$OUTPUT_DIR/directory-tree.txt"
  
  # 生成仅目录的树
  echo "Generating directory-only tree..."
  tree -d -L 4 -I 'node_modules|dist|build|coverage|venv|__pycache__|.git|.nuxt|.output' \
    > "$OUTPUT_DIR/directory-only-tree.txt"
  
  echo "✅ Tree files generated using 'tree' command"
else
  echo "⚠️  'tree' command not found, using 'find' fallback..."
  
  # 使用 find 命令生成目录树
  echo "Generating directory tree (using find)..."
  find . -maxdepth 4 \
    ! -path '*/node_modules/*' \
    ! -path '*/dist/*' \
    ! -path '*/build/*' \
    ! -path '*/coverage/*' \
    ! -path '*/venv/*' \
    ! -path '*/__pycache__/*' \
    ! -path '*/.git/*' \
    ! -path '*/.nuxt/*' \
    ! -path '*/.output/*' \
    ! -name 'pnpm-lock.yaml' \
    ! -name 'package-lock.json' \
    -print | sed 's|^\./||' | sort > "$OUTPUT_DIR/directory-tree.txt"
  
  # 仅目录
  echo "Generating directory-only tree..."
  find . -maxdepth 4 -type d \
    ! -path '*/node_modules/*' \
    ! -path '*/dist/*' \
    ! -path '*/build/*' \
    ! -path '*/coverage/*' \
    ! -path '*/venv/*' \
    ! -path '*/__pycache__/*' \
    ! -path '*/.git/*' \
    ! -path '*/.nuxt/*' \
    ! -path '*/.output/*' \
    -print | sed 's|^\./||' | sort > "$OUTPUT_DIR/directory-only-tree.txt"
  
  echo "✅ Tree files generated using 'find' command"
  echo "ℹ️  For better tree visualization, install 'tree': brew install tree (macOS) or apt-get install tree (Linux)"
fi

echo ""
echo "=== Generated Files ==="
echo ""
ls -lh "$OUTPUT_DIR"/*.txt 2>/dev/null || echo "No tree files found"

echo ""
echo "=== File Count Summary ==="
echo ""

# 统计文件类型
if [ -f "$OUTPUT_DIR/directory-tree.txt" ]; then
  echo "Total entries: $(wc -l < "$OUTPUT_DIR/directory-tree.txt")"
  echo ""
  
  echo "File types breakdown:"
  grep -E '\.(ts|tsx|js|jsx|vue|py|go|md|json|yaml|yml)$' "$OUTPUT_DIR/directory-tree.txt" 2>/dev/null | \
    sed 's/.*\.//' | sort | uniq -c | sort -rn || echo "No common file types found"
fi

echo ""
echo "=== Directory Tree Generation Complete ==="
echo ""
echo "📁 View generated trees:"
echo "   Full tree: $OUTPUT_DIR/directory-tree.txt"
echo "   Directories only: $OUTPUT_DIR/directory-only-tree.txt"
echo ""
echo "💡 Tips:"
echo "   - Review the tree to understand project structure"
echo "   - Use tree files for documentation"
echo "   - Update tree after major structural changes"
echo ""
