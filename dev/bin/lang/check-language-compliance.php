<?php
declare(strict_types=1);
require_once 'vendor/autoload.php';

$file = 'dev/json/language/templates/language-template.json';
$main_file = 'dev/json/language/language-strings.json';

$template_json = \json_decode(\file_get_contents($file), true);
$file_json = \json_decode(\file_get_contents($main_file), true);

foreach ($file_json as $lang_code => $strings) {
	var_dump($lang_code);
	var_dump($strings);
}