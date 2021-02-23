<?php
declare(strict_types=1);
require_once 'vendor/autoload.php';

$file_name_input = new ReadInput('What is the path to the file this string is held? (relative from /view/html/): ');
$file_name_input->prompt();
$file_name = $file_name_input->get_answer();

// does the file exist?
if (empty($file_name) || !\file_exists('view/html/'.$file_name)) {
	echo TerminalOutput::build_string('We can\'t find that file.', 'RED');
	$ending_paren = TerminalOutput::build_string(').', 'RED', false);
	$php_command = TerminalOutput::build_string('php dev/bin/lang/add-string.php', 'WHITE', false);
	echo TerminalOutput::build_string('Make sure you run this script from the root of the repo (so your command should look like this: '.$php_command.$ending_paren, 'RED');
	$file_path = TerminalOutput::build_string('includes/your-file.php', 'WHITE', false);
	echo TerminalOutput::build_string('Additionally, make sure your file path is realtive to the path /view/html (so if your file is at /view/html/includes/your-file.php, your input should read: '.$file_path.$ending_paren, 'RED');
	TerminalOutput::exit_script(1);
}

// is it a PHP file?
$file_extension = \strtolower(\explode('.', $file_name)[\count(\explode('.', $file_name)) - 1]);
if ($file_extension !== "php") {
	echo TerminalOutput::build_string('This file MUST be a PHP file.', 'RED');
	TerminalOutput::exit_script(1);
}

$language_string_file = new JsonFileHandler('dev/json/language/templates/language-template.json');
$data_in_file = $language_string_file->get_decoded_json();
if (empty($data_in_file[$file_name])) {
	$data_in_file[$file_name] = array();
	$language_string_file->write_to_file(json_encode($data_in_file));
}

// is it an attribute?
$attribute_or_not = new ReadInput('Is this string in an attribute Y/n? ');
$attribute_or_not->prompt();
$attribute_answer = $attribute_or_not->get_answer();
while (!\preg_match('/^[Yy|Nn]{1}$/', $attribute_answer)) {
	$new_ask = new ReadInput('Please answer with the character Y/n: is this string in an attribute? ');
	$new_ask->prompt();
	$attribute_answer = $new_ask->get_answer();
}

if (\strtolower($attribute_answer) === 'y') {
	// it is an attribute
} else {
	// it is just the plain text content for an element
}

// add in the field to the language-template.json
// update all of the languages in language-strings.php
// beautify the language-strings.php