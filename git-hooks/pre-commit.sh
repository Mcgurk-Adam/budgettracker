#!/bin/sh
composer install
composer update
composer install -o
# vendor/bin/phpcs model
# /bin/bash build_assets.sh
vendor/bin/phpunit tests
# analysis on languages
