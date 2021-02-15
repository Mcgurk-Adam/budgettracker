<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadNewLanguageTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(ReadNewLanguage::class, new ReadNewLanguage());
	}

	public function testRegex(): void {
		$read_input = new ReadNewLanguage();
		$reflected_class = new ReflectionClass($read_input);
		$property = $reflected_class->getProperty('valid_regex');
		$property->setAccessible(true);
		var_dump($property);
	}

}