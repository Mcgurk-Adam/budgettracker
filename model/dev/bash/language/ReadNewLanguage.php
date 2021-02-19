<?php
declare(strict_types=1);

final class ReadNewLanguage extends ReadInput {

	private static $valid_regex = '/^[a-z]{2}$/';

	public function __construct(string $prompt) {
		parent::__construct($prompt);
	}

	public function validate_input(): void {
		if (empty($this->answer_string) || !\preg_match(self::$valid_regex, $this->answer_string)) {
			throw new BashInputException('Please provide valid input');
		}
	}

}