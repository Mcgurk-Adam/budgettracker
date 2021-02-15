<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadInputTest extends TestCase {

	public function testBuildsString(): void {
		$this->assertString(TerminalOutput::build_string('This should be built just fine'));
	}

	public function testThrowsExceptionOnInvalidColor(): void {
		$this->expectException(TerminalOutputException::class);
		TerminalOutput::get_bash_color_code('DOES NOT EXIST');
	}

}