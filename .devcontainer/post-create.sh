#!/usr/bin/env bash
# Runs once automatically after the devcontainer is (re)built.
set -euo pipefail

cd /workspace

echo "==> Installing the module's composer dependencies (require + require-dev)"
composer install --no-interaction --prefer-dist

cat <<'EOF'

Devcontainer ready. Everything runs directly against /workspace:

  vendor/bin/phpunit
  composer run-script phpstan-analyse
  composer run-script rector-dryrun
  composer run-script rector-process
  composer run-script phpcsfixer-fix

EOF
