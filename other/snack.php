<?php
	$str = "Riu4bIALQ5QqqlOh5577765BN8z9i4OdFzuAGg=";
	phpFunction($str);

	function phpFunction($value){
		$hashed = hash('sha256', $value);
		$var = $hashed;

		$bytes = [];
		for($i = 0; $i < mb_strlen($var, 'UTF8'); $i++)
		{
		   array_push($bytes, ord($var[$i]));
		}

		$subbytes = array_slice($bytes, 0, 8);
		$unpacked = unpack("Q", pack('C*', ...$subbytes));
		echo current($unpacked);
	}

?>