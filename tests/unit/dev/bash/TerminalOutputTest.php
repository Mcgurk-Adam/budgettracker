<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class TerminalOutputTest extends TestCase {

	public function testBuildsString(): void {
		$this->assertIsString(TerminalOutput::build_string('This should be built just fine'));
	}

	public function testThrowsExceptionOnInvalidColor(): void {
		$this->expectException(TerminalOutputException::class);
		TerminalOutput::get_bash_color_code('DOES NOT EXIST');
	}

	public function testGetsColorCode(): void {
		$this->assertEquals(TerminalOutput::get_bash_color_code('WHITE'), 97);
	}

}