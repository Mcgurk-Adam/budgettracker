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

$file_extension = \strtolower(\explode('.', $file_name)[\count(\explode('.', $file_name)) - 1]);

// is it a PHP file?
if ($file_extension !== "php") {
	echo TerminalOutput::build_string('This file MUST be a PHP file.', 'RED');
	TerminalOutput::exit_script(1);
}
// Get the file name
// add in the field