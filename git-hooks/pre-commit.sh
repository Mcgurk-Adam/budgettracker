#!/bin/sh
dev/bin/hook-helpers/move-changed-hooks.sh
composer install
composer update
composer install -o
# vendor/bin/phpcs model
# /bin/bash build_assets.sh
vendor/bin/phpunit tests
php dev/bin/lang/pre-commit-check-language-compliance.php
