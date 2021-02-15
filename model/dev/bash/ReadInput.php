<?php
declare(strict_types=1);

class ReadInput {

	protected $prompt_string;
	protected $answer_string;

	public function __construct(string $question) {
		$this->prompt_string = $question;
	}

	public function prompt(): void {
		$this->set_answer(\readline($this->prompt_string));
	}

	protected function set_answer(string $answer): void {
		$this->answer_string = \strtolower(\trim($answer));
	}

	public function get_answer(): string {
		return $this->answer_string;
	}

}

final class BashInputException extends \Exception {}