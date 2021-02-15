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

	public function testRetrievesArrayFromJson(): void {
		$json_file = new JsonFileHandler('dev/json/language/templates/language-template.json');
		$this->assertIsArray($json_file->get_decoded_json());
	}

}