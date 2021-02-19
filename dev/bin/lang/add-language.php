<?php
declare(strict_types=1);
require_once 'vendor/autoload.php';

$new_read = new ReadNewLanguage('What is the two digit language code you would like to add? ');
$new_read->prompt();
try {
	$new_read->validate_input();
} catch (BashInputException $ex) {
	echo TerminalOutput::build_string($ex->getMessage(), 'RED');
	TerminalOutput::exitScript(1);
}
echo TerminalOutput::build_string('Answer is: '.$new_read->get_answer(), 'GREEN');