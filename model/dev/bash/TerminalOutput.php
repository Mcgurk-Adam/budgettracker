<?php
declare(strict_types=1);

final class TerminalOutput {

	private const RED = '31';
	private const GREEN = '32';
	private const YELLOW = '33';
	private const BLUE = '34';
	private const PURPLE = '35';
	private const WHITE = '97';

	public static function build_string(string $string_to_display, string $color = 'WHITE', bool $add_new_line = true): string {
		$str = "\033[0;" . self::get_bash_color_code($color) . "m" . $string_to_display . "\033[0m";
		if ($add_new_line) {
			$str .= "\n";
		}
		return $str;
	}

	public static function get_bash_color_code(string $color_name): int {
		switch ($color_name) {
			case 'RED':
				return 31;	
			break;
			case 'GREEN':
				return 32;
			break;
			case 'YELLOW':
				return 33;
			break;
			case 'BLUE':
				return 34;
			break;
			case 'MAGENTA':
				return 35;
			break;
			case 'WHITE':
				return 97;
			break;
			default:
				throw new TerminalOutputException('That color code is out of bounds for this application.');
		}
	}

	public static function exitScript(int $exitCode = 0): void {
		exit($exitCode);
	}

}

final class TerminalOutputException extends \Exception {}