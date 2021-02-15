<?php
declare(strict_types=1);
require_once 'vendor/autoload.php';

$new_read = new ReadNewLanguage();
$new_read->prompt();
try {
	$new_read->validate_input();
} catch (BashInputException $ex) {
	echo $ex->getMessage();
	exit(1);
}
echo 'Answer is: '.$new_read->get_answer();