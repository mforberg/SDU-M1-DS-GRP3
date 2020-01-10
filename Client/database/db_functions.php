<?php
require 'db_config.php';

class db_functions{
    private $db_config;

    public function __construct()
    {
        $this->db_config = new db_config();
    }

    function get_sensor_locations($month, $year){
        $conn = $this->db_config->getConnection();
        $statement = $conn->prepare('
                SELECT lat, lon 
                FROM (
                    SELECT lat, lon, SUBSTRING(ts, 1, 4) as _year, SUBSTRING(ts, 6, 2) as _month 
                    FROM sensors) x
                WHERE _year = :year AND _month = :month
                ');
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':year', $year);
        $statement->bindParam(':month', $month);
        $statement->execute();
        $result = $statement->fetchAll();
        $conn = null;
        return $result;
    }

    function get_clusters($month, $year){
        $conn = $this->db_config->getConnection();
        $statement = $conn->prepare('
                SELECT id, lat, lon, P1 
                FROM (
                    SELECT id, lat, lon, SUBSTRING(ts, 1, 4) as _year, SUBSTRING(ts, 6, 2) as _month, P1 
                    FROM clusters) x
                WHERE _year = :year AND _month = :month
                ');
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':year', $year);
        $statement->bindParam(':month', $month);
        $statement->execute();
        $result = $statement->fetchAll();
        $conn = null;
        return $result;
    }

    function get_normalize_values($month, $year){
        $conn = $this->db_config->getConnection();
        $statement = $conn->prepare('
                SELECT low, high 
                FROM (
                    SELECT low, high, SUBSTRING(ts, 1, 4) as _year, SUBSTRING(ts, 6, 2) as _month 
                    FROM normalize_values) x
                WHERE _year = :year AND _month = :month

                ');
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindParam(':year', $year);
        $statement->bindParam(':month', $month);
        $statement->execute();
        $result = $statement->fetchAll();
        $conn = null;
        return $result;
    }

    function update_clusters(){
        foreach (glob("jsondata/clusters/*.json") as $filepath) {
            $obj = json_decode(file_get_contents($filepath), true);
            $low = $obj[0];
            $high = $obj[1];
            $ts = $obj[2];
            $this->insert_normalize($ts, $low, $high);
            $clusters = $obj[3];
            foreach ($clusters as $cluster){
                $lat = $cluster[0];
                $lon = $cluster[1];
                $P1 = $cluster[2];
                $this->insert_cluster($lat, $lon, $ts, $P1);
            }
            $filename = basename($filepath);
            rename($filepath, "readdata\\$filename");
        }
    }

    function update_sensors(){
        foreach (glob("jsondata/sensors/*.json") as $filepath) {
            $obj = json_decode(file_get_contents($filepath), true);
            $sensors = $obj[0];
            foreach ($obj as $sensor){
                $ts = $sensor[0];
                $lat = $sensor[1];
                $lon = $sensor[2];
                $this->insert_sensor($lat, $lon, $ts);
            }
            $filename = basename($filepath);
            rename($filepath, "readdata\\$filename");
        }
    }

    function insert_cluster($lat, $long, $ts, $P1){
        $conn = $this->db_config->getConnection();
        $statement = $conn->prepare('insert into clusters (lat, lon, ts, P1) values (:lat, :lon, :ts, :P1)');
        $statement->bindParam(':lat', $lat);
        $statement->bindParam(':lon', $long);
        $statement->bindParam(':ts', $ts);
        $statement->bindParam(':P1', $P1);
        $statement->execute();
        $conn = null;
    }

    function insert_normalize($ts, $low, $high){
        $conn = $this->db_config->getConnection();
        $statement = $conn->prepare('insert into normalize_values (ts, low, high) values (:ts, :low, :high)');
        $statement->bindParam(':ts', $ts);
        $statement->bindParam(':low', $low);
        $statement->bindParam(':high', $high);
        $statement->execute();
        $conn = null;
    }

    function insert_sensor($lat, $lon, $ts){
        $conn = $this->db_config->getConnection();
        $statement = $conn->prepare('insert into sensors (lat, lon, ts) values (:lat, :lon, :ts)');
        $statement->bindParam(':lat', $lat);
        $statement->bindParam(':lon', $lon);
        $statement->bindParam(':ts', $ts);
        $statement->execute();
        $conn = null;
    }
}