<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 20-03-2019
 * Time: 10:23
 */

class db_config {
    private $conn = null;

    public function __construct()
    {
    }

    function getConnection()
    {
        if ($this ->conn === null){
            $hostname = 'localhost';
            $username = 'root';
            $password = '';
            $db = 'sensordata';
            $port = 3306;
            $dsn = "mysql:dbname={$db};host={$hostname};port={$port};charset=utf8";
            try {
                $conn = new PDO($dsn, $username, $password);
            } catch (PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
            $this -> conn = $conn;
            return $conn;
        }
        return $this -> conn;
    }
}


