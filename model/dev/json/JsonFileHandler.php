<?php
declare(strict_types=1);

final class JsonFileHandler {

	private $file_path;
	private $file_contents;

	public function __construct(string $file_path) {
		if (!\file_exists($file_path)) {
			throw new JsonFileException($file_path.' does not exist');
		}
		$this->file_path = $file_path;
		$this->file_contents = \file_get_contents($file_path);
	}

	public function get_decoded_json(): array {
		return \json_decode($this->file_contents, true);
	}

	public function write_to_file(string $stringified_json): void {
		$put_result = \file_put_contents($this->file_path, $stringified_json);
		if ($put_result === false) {
			throw new Exception('Something went wrong with the attempted file write');
		} else {
			$this->file_contents = $stringified_json;
		}
	}

}

final class JsonFileException extends \Exception {}