# Commit Message Validation Test Script
# Tests if commitlint configuration is working correctly

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Testing Commit Message Validation" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if commitlint is installed
Write-Host "Checking for commitlint..." -ForegroundColor Yellow
$hasCommitlint = $false

# Try global installation
if (Get-Command commitlint -ErrorAction SilentlyContinue) {
    $hasCommitlint = $true
    Write-Host "✅ commitlint found (global)" -ForegroundColor Green
}
# Try npx
elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    try {
        npx --no-install commitlint --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $hasCommitlint = $true
            Write-Host "✅ commitlint available via npx" -ForegroundColor Green
        }
    } catch {}
}

if (-not $hasCommitlint) {
    Write-Host "❌ commitlint not found. Installing temporarily..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run one of the following to install:" -ForegroundColor Cyan
    Write-Host "  npm install -g @commitlint/cli @commitlint/config-conventional" -ForegroundColor White
    Write-Host "  OR" -ForegroundColor Yellow
    Write-Host "  npx -y @commitlint/cli@latest --version" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Install temporarily with npx? (y/n)"
    if ($response -ne 'y') {
        Write-Host "Skipping test. Install commitlint to run validation tests." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Running Test Cases" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test cases: [message, should_pass, description]
$testCases = @(
    @{
        message = "feat(frontend): add timer node"
        shouldPass = $true
        description = "Valid feature commit with scope"
    },
    @{
        message = "fix(backend): resolve database timeout"
        shouldPass = $true
        description = "Valid bug fix with scope"
    },
    @{
        message = "docs: update contributing guide"
        shouldPass = $true
        description = "Valid docs commit without scope"
    },
    @{
        message = "feat(frontend)!: change project format"
        shouldPass = $true
        description = "Valid breaking change with !"
    },
    @{
        message = "chore(deps): update dependencies"
        shouldPass = $true
        description = "Valid chore with deps scope"
    },
    @{
        message = "Add new feature"
        shouldPass = $false
        description = "Invalid: missing type"
    },
    @{
        message = "feat: Add Feature"
        shouldPass = $false
        description = "Invalid: uppercase in subject"
    },
    @{
        message = "feat(frontend): add timer node."
        shouldPass = $false
        description = "Invalid: period at end"
    },
    @{
        message = "feature(frontend): add timer"
        shouldPass = $false
        description = "Invalid: wrong type (should be 'feat')"
    },
    @{
        message = "feat(wrongscope): add feature"
        shouldPass = $true
        description = "Warning: scope not in enum (still valid)"
    }
)

$passed = 0
$failed = 0
$testNumber = 1

foreach ($test in $testCases) {
    Write-Host "Test $testNumber/$($testCases.Count): $($test.description)" -ForegroundColor Cyan
    Write-Host "  Message: '$($test.message)'" -ForegroundColor Gray
    
    # Create temporary file with commit message
    $tempFile = [System.IO.Path]::GetTempFileName()
    $test.message | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
    
    # Run commitlint
    $output = ""
    $exitCode = 0
    
    try {
        if (Get-Command commitlint -ErrorAction SilentlyContinue) {
            $output = commitlint --config .commitlintrc.json --edit $tempFile 2>&1
            $exitCode = $LASTEXITCODE
        } else {
            $output = npx -y @commitlint/cli@latest --config .commitlintrc.json --edit $tempFile 2>&1
            $exitCode = $LASTEXITCODE
        }
    } catch {
        $output = $_.Exception.Message
        $exitCode = 1
    }
    
    Remove-Item $tempFile -ErrorAction SilentlyContinue
    
    $actuallyPassed = ($exitCode -eq 0)
    
    if ($actuallyPassed -eq $test.shouldPass) {
        Write-Host "  ✅ PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "  ❌ FAIL" -ForegroundColor Red
        Write-Host "  Expected: $(if ($test.shouldPass) { 'PASS' } else { 'FAIL' })" -ForegroundColor Yellow
        Write-Host "  Got:      $(if ($actuallyPassed) { 'PASS' } else { 'FAIL' })" -ForegroundColor Yellow
        if ($output) {
            Write-Host "  Output: $($output -join ' ')" -ForegroundColor Gray
        }
        $failed++
    }
    
    Write-Host ""
    $testNumber++
}

# Summary
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Tests: $($testCases.Count)" -ForegroundColor White
Write-Host "Passed:      $passed" -ForegroundColor Green
Write-Host "Failed:      $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 All tests passed! Commit validation is working correctly." -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some tests failed. Please review the commitlint configuration." -ForegroundColor Yellow
    exit 1
}
