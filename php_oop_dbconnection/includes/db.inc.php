<?php

//	DB CONNECTION

class Database
{
	private $db_address = 'localhost';
	private $db_user = 'root';
	private $db_pass = '';
	private $db_name = 'test';
	private $connection;

	//	CONSTRUCT
	public function __construct()
	{
		$this->connect();
	}

	//	HELPERS
	public function esc($input)
	{
		return $this->connection->real_escape_string($input);
	}

	//	DB FUNCTIONS
	public function connect()
	{
		$this->connection = new mysqli($this->db_address, $this->db_user, $this->db_pass, $this->db_name);

		if ($this->connection) {
			$this->connection->select_db("test");
			echo "You connected!";
		}
	}

	public function disconnect()
	{
		if ($this->connection) {
			$close = $this->connection->close();

			if ($close === false) {
				echo "Closing connection failed";
			} else {
				echo "Closing sonnection succeeded!";
			}
		}
	}

	public function select($table)
	{
		$esc_table = $this->esc($table);

		$stmt = $this->connection->prepare("SELECT * FROM $esc_table");
		$stmt->execute();
		$result = $stmt->get_result();

		while ($row = $result->fetch_assoc()) {
			// echo $row['message'];  COMMENTED OUT TO WORK ON OTHER STUFF
		}
	}

	public function insert($table, $col, $value)
	{
		$esc_table = $this->esc($table);
		$esc_col = $this->esc($col);
		$esc_val = $this->esc($value);

		$stmt = $this->connection->prepare("INSERT INTO $esc_table ($esc_col) VALUES ('$esc_val')");

		$stmt->execute();
	}

	public function delete($table, $id)
	{
		$esc_table = $this->esc($table);
		$esc_id = $this->esc($id);

		$stmt = $this->connection->prepare("DELETE FROM $esc_table WHERE id = ?");
		$stmt->bind_param("i", $esc_id);

		$stmt->execute();
	}
	public function update($table, $col, $value, $id)
	{
		$esc_table = $this->esc($table);
		$esc_col = $this->esc($col);
		$esc_val = $this->esc($value);
		$esc_id = $this->esc($id);

		$stmt = $this->connection->prepare("UPDATE $esc_table SET $esc_col = ? WHERE id = ?");
		$stmt->bind_param("si", $esc_val, $esc_id);

		$stmt->execute();
	}
}

//	Below are commands I'll run from other pages

$makeConnection = new Database;
/* $makeConnection->insert('test_table', 'message', 'this is secure'); */
/* $makeConnection->delete('test_table', 25); */
$makeConnection->update('test_table', 'message', 'This has been updated', 1);
$makeConnection->select('test_table');
