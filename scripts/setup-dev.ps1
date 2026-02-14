# Setup script for FlowForge development environment
# PowerShell version

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "FlowForge Development Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Configure git commit template
Write-Host "📝 Configuring git commit message template..." -ForegroundColor Yellow
try {
    git config commit.template .gitmessage
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Commit template configured successfully" -ForegroundColor Green
    } else {
        throw "Git config failed"
    }
} catch {
    Write-Host "❌ Failed to configure commit template" -ForegroundColor Red
    exit 1
}

# Verify git configuration
Write-Host ""
Write-Host "📋 Verifying git configuration..." -ForegroundColor Yellow
$template = git config commit.template
if ($template -eq ".gitmessage") {
    Write-Host "✅ Commit template: $template" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Commit template may not be set correctly" -ForegroundColor Yellow
}

# Check for Node.js
Write-Host ""
Write-Host "🔍 Checking for Node.js..." -ForegroundColor Yellow
$hasNode = Get-Command node -ErrorAction SilentlyContinue
$hasNpm = Get-Command npm -ErrorAction SilentlyContinue

if ($hasNode -and $hasNpm) {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    
    # Check if package.json exists
    Write-Host ""
    Write-Host "📦 Setting up commitlint dependencies..." -ForegroundColor Yellow
    
    if (-not (Test-Path "package.json")) {
        Write-Host "Creating package.json..." -ForegroundColor Cyan
        
        $packageJson = @{
            name = "flowforge"
            version = "0.1.0"
            description = "Visual no-code PLC programming environment"
            private = $true
            scripts = @{
                "test:commits" = "commitlint --from=HEAD~1"
                "prepare" = "husky || true"
            }
            devDependencies = @{
                "@commitlint/cli" = "^19.0.0"
                "@commitlint/config-conventional" = "^19.0.0"
                "husky" = "^9.0.0"
            }
            keywords = @("plc", "visual-programming", "beckhoff", "twincat")
            repository = @{
                type = "git"
                url = "https://github.com/your-org/FlowForge.git"
            }
        } | ConvertTo-Json -Depth 10
        
        $packageJson | Out-File -FilePath "package.json" -Encoding utf8
        Write-Host "✅ package.json created" -ForegroundColor Green
    } else {
        Write-Host "✅ package.json already exists" -ForegroundColor Green
    }
    
    # Install dependencies
    Write-Host ""
    Write-Host "📥 Installing commitlint and husky..." -ForegroundColor Yellow
    Write-Host "   This may take a minute..." -ForegroundColor Gray
    
    try {
        $installOutput = npm install --silent 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
            
            # Setup husky
            Write-Host ""
            Write-Host "🪝 Setting up git hooks with husky..." -ForegroundColor Yellow
            
            # Initialize husky
            npx husky init 2>&1 | Out-Null
            
            # Create commit-msg hook
            $hookPath = ".husky/commit-msg"
            if (-not (Test-Path ".husky")) {
                New-Item -ItemType Directory -Path ".husky" -Force | Out-Null
            }
            
            $hookContent = @"
npx --no -- commitlint --edit `$1
"@
            $hookContent | Out-File -FilePath $hookPath -Encoding utf8
            Write-Host "✅ Git hooks configured" -ForegroundColor Green
            
            # Test commitlint
            Write-Host ""
            Write-Host "🧪 Testing commitlint configuration..." -ForegroundColor Yellow
            $testFile = [System.IO.Path]::GetTempFileName()
            "feat(frontend): test commit" | Out-File -FilePath $testFile -Encoding utf8 -NoNewline
            
            $testOutput = npx commitlint --config .commitlintrc.json --edit $testFile 2>&1
            Remove-Item $testFile -ErrorAction SilentlyContinue
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Commitlint is working correctly!" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Commitlint test had issues, but installation completed" -ForegroundColor Yellow
            }
            
        } else {
            Write-Host "⚠️  Warning: npm install had issues" -ForegroundColor Yellow
            Write-Host "   You may need to run 'npm install' manually" -ForegroundColor Gray
        }
    } catch {
        Write-Host "⚠️  Warning: Could not install dependencies" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        Write-Host "   Run 'npm install' manually to complete setup" -ForegroundColor Gray
    }
    
} else {
    Write-Host "⚠️  Node.js and/or npm not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Commitlint validation requires Node.js and npm." -ForegroundColor Gray
    Write-Host "   Please install Node.js from: https://nodejs.org/" -ForegroundColor Gray
    Write-Host "   Then run this setup script again." -ForegroundColor Gray
}

# Display next steps
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Review Git Workflow Guide: doc\GIT_WORKFLOW.md"
Write-Host "2. Read Contributing Guidelines: CONTRIBUTING.md"
Write-Host "3. Try making a commit to test the validation!"
Write-Host ""
Write-Host "To create your first commit:" -ForegroundColor Yellow
Write-Host "  git commit"
Write-Host "  (Template will help you format the message)"
Write-Host ""
Write-Host "Branch naming conventions:" -ForegroundColor Yellow
Write-Host "  feature/your-feature-name"
Write-Host "  bugfix/issue-123-description"
Write-Host "  hotfix/critical-fix"
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
