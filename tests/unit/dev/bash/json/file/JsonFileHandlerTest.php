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

	public function testCanWriteToFile(): void {
		$json_file = new JsonFileHandler('dev/json/language/templates/language-template.json');
		$original_json_data = $json_file->get_decoded_json();
		$new_json_data = $original_json_data;
		$new_json_data['not-exists.php'] = array('title' => 'This won\'t exist, so don\'t even worry about it');
		$json_file->write_to_file(json_encode($new_json_data));
		$this->assertEquals($new_json_data, $json_file->get_decoded_json());
		$json_file->write_to_file(json_encode($original_json_data));
	}

}