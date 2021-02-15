<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class ReadNewLanguageTest extends TestCase {

	public function testCanInitClass(): void {
		$this->assertInstanceOf(ReadNewLanguage::class, new ReadNewLanguage());
	}

}