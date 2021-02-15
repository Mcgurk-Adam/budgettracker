<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class JsonFileHandlerTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(JsonFileHandler::class, new JsonFileHandler('dev/json/language/templates/language-template.json'));
	}

}