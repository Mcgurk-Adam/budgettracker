<?php
declare(strict_types=1);

final class TerminalCommand {

	private $command_string;
	private $output_array;
	private $result_code;
	private $last_line;

	public function __construct(string $command) {
		$this->command_string = $command;
		$this->output_array = array();
		$this->result_code = 0;
	}

	public function execute(bool $throw_on_error = true): void {
		$this->last_line = \exec($this->command_string, $this->output_array, $this->result_code);
		if ($throw_on_error && $this->result_code > 0) {
			throw new TerminalCommandException($this->get_last_line().'. The command exited with status code of :'.$this->get_result_code().'.');
		} else if ($this->last_line === false) {
			throw new \Exception('Sorry, there was a generic issue with this command.');
		}
	}

	public function get_result_code(): int {
		return $this->result_code;
	}

	public function get_full_output(): array {
		return $this->output_array;
	}

	public function get_last_line(): string {
		return $this->last_line;
	}

}

final class TerminalCommandException extends \Exception {}