<?php

require_once '../../../vendor/autoload.php';

$new_read = new ReadNewLanguage();
$new_read->prompt();
try {
	$new_read->validate_input();
} catch (BashInputException $ex) {
	echo $ex->getMessage();
	exit;
}
echo 'Answer is: '.$new_read->get_answer();