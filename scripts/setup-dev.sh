#!/bin/bash
# Setup script for FlowForge development environment

echo "========================================="
echo "FlowForge Development Setup"
echo "========================================="
echo ""

# Configure git commit template
echo "📝 Configuring git commit message template..."
git config commit.template .gitmessage
if [ $? -eq 0 ]; then
    echo "✅ Commit template configured successfully"
else
    echo "❌ Failed to configure commit template"
    exit 1
fi

# Verify git configuration
echo ""
echo "📋 Verifying git configuration..."
TEMPLATE=$(git config commit.template)
if [ "$TEMPLATE" = ".gitmessage" ]; then
    echo "✅ Commit template: $TEMPLATE"
else
    echo "⚠️  Warning: Commit template may not be set correctly"
fi

# Check for Node.js
echo ""
echo "🔍 Checking for Node.js..."
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    echo "✅ Node.js: $NODE_VERSION"
    echo "✅ npm: $NPM_VERSION"
    
    # Check if package.json exists
    echo ""
    echo "📦 Setting up commitlint dependencies..."
    
    if [ ! -f "package.json" ]; then
        echo "Creating package.json..."
        
        cat > package.json << 'EOF'
{
  "name": "flowforge",
  "version": "0.1.0",
  "description": "Visual no-code PLC programming environment",
  "private": true,
  "scripts": {
    "test:commits": "commitlint --from=HEAD~1",
    "prepare": "husky || true"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "husky": "^9.0.0"
  },
  "keywords": ["plc", "visual-programming", "beckhoff", "twincat"],
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/FlowForge.git"
  }
}
EOF
        echo "✅ package.json created"
    else
        echo "✅ package.json already exists"
    fi
    
    # Install dependencies
    echo ""
    echo "📥 Installing commitlint and husky..."
    echo "   This may take a minute..."
    
    if npm install --silent 2>&1; then
        echo "✅ Dependencies installed successfully"
        
        # Setup husky
        echo ""
        echo "🪝 Setting up git hooks with husky..."
        
        # Initialize husky
        npx husky init 2>&1 > /dev/null || true
        
        # Create commit-msg hook
        mkdir -p .husky
        cat > .husky/commit-msg << 'EOF'
npx --no -- commitlint --edit $1
EOF
        chmod +x .husky/commit-msg
        echo "✅ Git hooks configured"
        
        # Test commitlint
        echo ""
        echo "🧪 Testing commitlint configuration..."
        TEMP_FILE=$(mktemp)
        echo -n "feat(frontend): test commit" > "$TEMP_FILE"
        
        if npx commitlint --config .commitlintrc.json --edit "$TEMP_FILE" 2>&1 > /dev/null; then
            echo "✅ Commitlint is working correctly!"
        else
            echo "⚠️  Commitlint test had issues, but installation completed"
        fi
        rm -f "$TEMP_FILE"
        
    else
        echo "⚠️  Warning: npm install had issues"
        echo "   You may need to run 'npm install' manually"
    fi
    
else
    echo "⚠️  Node.js and/or npm not found"
    echo ""
    echo "   Commitlint validation requires Node.js and npm."
    echo "   Please install Node.js from: https://nodejs.org/"
    echo "   Then run this setup script again."
fi

# Display next steps
echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review Git Workflow Guide: doc/GIT_WORKFLOW.md"
echo "2. Read Contributing Guidelines: CONTRIBUTING.md"
echo "3. Try making a commit to test the validation!"
echo ""
echo "To create your first commit:"
echo "  git commit"
echo "  (Template will help you format the message)"
echo ""
echo "Branch naming conventions:"
echo "  feature/your-feature-name"
echo "  bugfix/issue-123-description"
echo "  hotfix/critical-fix"
echo ""
echo "Happy coding! 🚀"
