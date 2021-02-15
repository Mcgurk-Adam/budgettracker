<?php
declare(strict_types=1);

final class JsonFileHandler {

	private $file_contents;

	public function __construct(string $file_path) {
		if (!\file_exists($file_path)) {
			throw new JsonFileException($file_path.' does not exist');
		}
		$this->file_contents = \file_get_contents($file_path);
	}

	public function get_decoded_json(): array {
		return \json_decode($this->file_contents, true);
	}

}

final class JsonFileException extends \Exception {}