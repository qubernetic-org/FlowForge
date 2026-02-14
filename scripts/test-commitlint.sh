#!/bin/bash
# Commit Message Validation Test Script
# Tests if commitlint configuration is working correctly

echo "========================================="
echo "Testing Commit Message Validation"
echo "========================================="
echo ""

# Check if commitlint is installed
echo "Checking for commitlint..."
HAS_COMMITLINT=false

if command -v commitlint &> /dev/null; then
    HAS_COMMITLINT=true
    echo "✅ commitlint found (global)"
elif command -v npx &> /dev/null; then
    if npx --no-install commitlint --version &> /dev/null; then
        HAS_COMMITLINT=true
        echo "✅ commitlint available via npx"
    fi
fi

if [ "$HAS_COMMITLINT" = false ]; then
    echo "❌ commitlint not found."
    echo ""
    echo "Run one of the following to install:"
    echo "  npm install -g @commitlint/cli @commitlint/config-conventional"
    echo "  OR"
    echo "  npx -y @commitlint/cli@latest --version"
    echo ""
    read -p "Install temporarily with npx? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping test. Install commitlint to run validation tests."
        exit 0
    fi
fi

echo ""
echo "========================================="
echo "Running Test Cases"
echo "========================================="
echo ""

# Test function
run_test() {
    local message="$1"
    local should_pass="$2"
    local description="$3"
    local test_num="$4"
    local total_tests="$5"
    
    echo "Test $test_num/$total_tests: $description"
    echo "  Message: '$message'"
    
    # Create temporary file
    temp_file=$(mktemp)
    echo -n "$message" > "$temp_file"
    
    # Run commitlint
    if command -v commitlint &> /dev/null; then
        commitlint --config .commitlintrc.json --edit "$temp_file" &> /dev/null
    else
        npx -y @commitlint/cli@latest --config .commitlintrc.json --edit "$temp_file" &> /dev/null
    fi
    exit_code=$?
    
    rm -f "$temp_file"
    
    actually_passed=false
    if [ $exit_code -eq 0 ]; then
        actually_passed=true
    fi
    
    if { [ "$should_pass" = true ] && [ "$actually_passed" = true ]; } || \
       { [ "$should_pass" = false ] && [ "$actually_passed" = false ]; }; then
        echo "  ✅ PASS"
        return 0
    else
        echo "  ❌ FAIL"
        if [ "$should_pass" = true ]; then
            echo "  Expected: PASS, Got: FAIL"
        else
            echo "  Expected: FAIL, Got: PASS"
        fi
        return 1
    fi
}

# Test cases
passed=0
failed=0
test_num=1
total_tests=10

# Valid tests
run_test "feat(frontend): add timer node" true "Valid feature commit with scope" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "fix(backend): resolve database timeout" true "Valid bug fix with scope" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "docs: update contributing guide" true "Valid docs commit without scope" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "feat(frontend)!: change project format" true "Valid breaking change with !" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "chore(deps): update dependencies" true "Valid chore with deps scope" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

# Invalid tests
run_test "Add new feature" false "Invalid: missing type" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "feat: Add Feature" false "Invalid: uppercase in subject" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "feat(frontend): add timer node." false "Invalid: period at end" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "feature(frontend): add timer" false "Invalid: wrong type" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

run_test "feat(wrongscope): add feature" true "Warning: scope not in enum (still valid)" $test_num $total_tests
[ $? -eq 0 ] && ((passed++)) || ((failed++))
((test_num++))
echo ""

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
echo "Total Tests: $total_tests"
echo "Passed:      $passed"
echo "Failed:      $failed"
echo ""

if [ $failed -eq 0 ]; then
    echo "🎉 All tests passed! Commit validation is working correctly."
    exit 0
else
    echo "⚠️  Some tests failed. Please review the commitlint configuration."
    exit 1
fi
