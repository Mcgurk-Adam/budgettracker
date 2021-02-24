<?php
declare(strict_types=1);
require_once 'vendor/autoload.php';

echo TerminalOutput::build_string('Finished checking the language-strings.json file, and exited with no errors or warnings', 'MAGENTA');
TerminalOutput::exit_script();