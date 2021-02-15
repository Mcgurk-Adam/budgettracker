<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadInputTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(ReadInput::class, new ReadInput('Test prompt'));
	}

	public function testSanitizationOfUserInput(): void {

		// init object
		$read_input = new ReadInput('Test prompt');

		// set accessibility of class method to be open just for the test and call it
		$reflected_class = new ReflectionClass($read_input);
		$method = $reflected_class->getMethod('set_answer');
		$method->setAccessible(true);
		$method->invokeArgs($read_input, ['      needs Trimmed    ']);

		// run test
		$this->assertEquals($read_input->get_answer(), 'needs trimmed');
	}

}