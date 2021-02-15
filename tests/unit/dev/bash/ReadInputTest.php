<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadInputTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(ReadInput::class, new ReadInput('Test prompt'));
	}

	public function testSanitizationOfUserInput(): void {

		$read_input = new ReadInput('Test prompt');

		$reflected_class = new ReflectionClass($read_input);

	}

}