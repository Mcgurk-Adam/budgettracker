<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadInputTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(ReadInput::class, new ReadInput('Test prompt'));
	}

}