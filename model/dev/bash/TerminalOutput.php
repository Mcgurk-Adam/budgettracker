<?php
declare(strict_types=1);

final class TerminalOutput {

	private const RED = '31';
	private const GREEN = '32';
	private const YELLOW = '33';
	private const BLUE = '34';
	private const PURPLE = '35';
	private const WHITE = '97';

	public function build_string(string $string_to_display, string $color = WHITE, bool $add_new_line = true): string {
		$str = "\033[0;" . self::$color . "m" . $string_to_display . "\033[0m";
		if ($add_new_line) {
			$str .= "\n";
		}
		return $str;
	}

}