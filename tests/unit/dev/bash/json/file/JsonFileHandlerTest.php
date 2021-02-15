<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class JsonFileHandlerTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(JsonFileHandler::class, new JsonFileHandler('dev/json/language/templates/language-template.json'));
	}

	public function testThrowsExceptionOnInvalidFilePath(): void {
		$this->expectException(JsonFileException::class);
		new JsonFileHandler('dev/not/real/language.json');
	}

}