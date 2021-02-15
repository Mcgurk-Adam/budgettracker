<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadNewLanguageTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(ReadNewLanguage::class, new ReadNewLanguage());
	}

	public function testRegex(): void {

		// exposing the property
		$read_input = new ReadNewLanguage();
		$reflected_class = new ReflectionClass($read_input);
		$property = $reflected_class->getProperty('valid_regex');
		$property->setAccessible(true);

		// we need to assertTrue the inverse of the return, because the expected return could either be false OR 0 . Both are falsy, but phpunit matches exactly false when calling assertFalse()
		$this->assertTrue(!\preg_match($property->getValue(), 'english'));
	}

}