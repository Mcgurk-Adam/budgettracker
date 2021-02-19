<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadNewLanguageTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(ReadNewLanguage::class, new ReadNewLanguage('This is a test of the language echoing'));
	}

	public function testRegex(): void {
		// exposing the property
		$read_input = new ReadNewLanguage('This is a test of the language echoing');
		$reflected_class = new ReflectionClass($read_input);
		$property = $reflected_class->getProperty('valid_regex');
		$property->setAccessible(true);

		// we need to assertTrue the inverse of the return, because the expected return could either be false OR 0 . Both are falsy, but phpunit matches exactly false when calling assertFalse()
		$this->assertTrue(!\preg_match($property->getValue(), 'english'));
		//this is just a regular match. A "correct" return will return 1 here
		$this->assertEquals(\preg_match($property->getValue(), 'en'), 1);
	}

	public function testThrowsExceptionOnEmpty(): void {
		$read_input = new ReadNewLanguage('This is a test of the language echoing');
		$this->expectException(BashInputException::class);
		$read_input->validate_input();
	}

	public function testThrowsExceptionOnInvalidValue(): void {
		// exposing the method
		$read_input = new ReadNewLanguage('This is a test of the language echoing');
		$reflected_class = new ReflectionClass($read_input);
		$method = $reflected_class->getMethod('set_answer');
		$method->setAccessible(true);
		$method->invokeArgs($read_input, ['english']);
		$this->expectException(BashInputException::class);
		$read_input->validate_input();
	}

}