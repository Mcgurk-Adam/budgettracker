<?php
declare(strict_types=1);

final class TerminalOutput {

	const RED = '31';
	const GREEN = '32';
	const YELLOW = '33';
	const BLUE = '34';
	const PURPLE = '35';
	const WHITE = '97';

	public function build_string(string $string_to_display, int $color = WHITE, bool $add_new_line = true): string {
		$str = "\033[0;" . self::$color . "m" . $string_to_display . "\033[0m";
		if ($add_new_line) {
			$str .= "\n";
		}
		return $str;
	}

}