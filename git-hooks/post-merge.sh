#!/bin/sh
./dev/bin/hook-helpers/move-changed-hooks
composer install
composer update
composer install -o