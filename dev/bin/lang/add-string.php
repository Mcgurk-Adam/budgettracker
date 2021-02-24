<?php
declare(strict_types=1);
require_once 'vendor/autoload.php';

$file_name_input = new ReadInput('What is the path to the file this string is held? (relative from /view/html/): ');
$file_name_input->prompt();
$file_name = $file_name_input->get_answer();
while (empty($file_name)) {
	$file_name_input->prompt();
	$file_name = $file_name_input->get_answer();
}

// does the file exist?
if (!\file_exists('view/html/'.$file_name)) {
	echo TerminalOutput::build_string('We can\'t find that file.', 'RED');
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

// what is the element tree
// disallow spaces here TO DO
$element_tree = new ReadInput('What is the IN-FILE element descendence? Seperate levels with periods (ie -> "section.h1"): ');
$element_tree->prompt();
$element_tree_answer = $element_tree->get_answer();

$current_data_in_file = $language_string_file->get_decoded_json();
if (empty($current_data_in_file[$file_name][$element_tree_answer])) {
	$current_data_in_file[$file_name][$element_tree_answer] = array();
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
	$attribute_name = new ReadInput('What is the name of the attribute you would like to add? ');
	$attribute_name->prompt();
	$current_data_in_file[$file_name][$element_tree_answer][$attribute_name->get_answer()] = '';
} else {
	$current_data_in_file[$file_name][$element_tree_answer]['innerText'] = '';
}

$language_string_file->write_to_file(json_encode($current_data_in_file));

// update all of the languages in language-strings.php
$all_languages_file = new JsonFileHandler('dev/json/language/language-strings.json');
$all_languages = $all_languages_file->get_decoded_json();
foreach ($all_languages as &$language_data) {
	// this should never be triggered, but just in case
	if (empty($language_data)) {
		$language_data = $language_string_file->get_decoded_json();
		continue;
	}
	$template_file_data = $language_string_file->get_decoded_json();
	// getting all necessary strings and templates in there if they exist or not
	foreach ($template_file_data as $file_path => $data) {
		if (empty($language_data[$file_path])) {
			$language_data[$file_path] = $data;
			continue;
		}
		// it does exist, we're gonna have to go deeper
		foreach ($data as $ele => $attribute_data) {
			if (empty($language_data[$file_path][$ele])) {
				$language_data[$file_path][$ele] = $attribute_data;
				continue;
			}
			$desired_attribute_to_add = (\strtolower($attribute_answer) === 'y' ? $attribute_name->get_answer() : 'innerText');
			$language_data[$file_path][$ele][$desired_attribute_to_add] = '';
		}
	}

	// cleaning up the file from anything that happened outside of the APPROVED way of happening
	foreach ($language_data as $file_path => $file_elements) {
		if (empty($template_file_data[$file_path])) {
			unset($language_data[$file_path]);
			continue;
		}
		foreach ($file_elements as $ele_path => $string_data) {
			if (empty($template_file_data[$file_path][$ele_path])) {
				unset($language_data[$file_path][$ele_path]);
				continue;
			}
			foreach ($string_data as $name => $value) {
				if (empty($template_file_data[$file_path][$ele_path][$name])) {
					unset($language_data[$file_path][$ele_path][$name]);
				}
			}
		}
	}

}
$all_languages_file->write_to_file(json_encode($all_languages));
$all_languages_file->beautify_file();
// beautify the language-strings.php
