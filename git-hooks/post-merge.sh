#!/bin/sh
dev/bin/hook-helpers/move-changed-hooks.sh
composer install
composer update
composer install -o