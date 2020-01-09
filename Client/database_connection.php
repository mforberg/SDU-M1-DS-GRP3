<?php
require 'db_config.php';

$aResult = array();
if( !isset($_GET['functionname']) ) { $aResult['error'] = 'No function name!'; }
if( !isset($aResult['error']) ) {
    switch($_GET['functionname']) {
        case 'getData':
            if(!isset($_GET['monthnumber']) || !isset($_GET['yearnumber'])) {
                $aResult['error'] = 'No function arguments!';
            } else {
                $pp = new db_functions();
                $aResult['result']['sensor_location'] = $pp->get_sensor_locations($_GET['monthnumber'], $_GET['yearnumber']);
                $aResult['result']['clusters'] = $pp->get_clusters($_GET['monthnumber'], $_GET['yearnumber']);
                $aResult['result']['normalize_values'] = $pp->get_normalize_values($_GET['monthnumber'], $_GET['yearnumber']);
            }
            break;
        case 'updateData':
            $pp = new db_functions();
            $pp->update_clusters();
            $pp->update_sensors();
            $aResult['result'] = "updated";

            break;
//        case 'getLocationData':
//            if(!isset($_GET['monthnumber']) || !isset($_GET['yearnumber'])) {
//                $aResult['error'] = 'No function arguments!';
//            } else {
//                $aResult['result']['sensor_location'] = get_sensor_locations();
//                $aResult['result']['clusters'] = get_clusters($_GET['monthnumber'], $_GET['yearnumber']);
//                $aResult['result']['normalize_values'] = get_normalize_values($_GET['monthnumber'], $_GET['yearnumber']);
////                if(empty($aResult['result']['sensor_location']) || empty($aResult['result']['cluster_location'])){
////                    $aResult['error'] = 'No data found!';
////                }
//            }
//            break;
//        case 'getClusters':
//            if(!isset($_GET['monthnumber']) || !isset($_GET['yearnumber'])) {
//                $aResult['error'] = 'No function arguments!';
//            } else {
//                $aResult['result'] = get_clusters($_GET['monthnumber'], $_GET['yearnumber']);
//                if(empty($aResult['result'])){
//                    $aResult['error'] = 'month or year not right!';
//                }
//            }
//            break;
//        case 'getClustersAndNormalValues':
//            if(!isset($_GET['monthnumber']) || !isset($_GET['yearnumber'])) {
//                $aResult['error'] = 'No function arguments!';
//            } else {
//                $aResult['result']['clusters'] = get_clusters($_GET['monthnumber'], $_GET['yearnumber']);
//                $aResult['result']['normalize_values'] = get_normalize_values($_GET['monthnumber'], $_GET['yearnumber']);
//                if(empty($aResult['result'])){
//                    $aResult['error'] = 'Cluster ID or year not right!';
//                }
//            }
//            break;
//        case 'getSensors':
//            if(!isset($_GET['monthnumber']) || !isset($_GET['yearnumber'])) {
//                $aResult['error'] = 'No function arguments!';
//            } else {
//                $aResult['result'] = get_sensors_pm($_GET['monthnumber'], $_GET['yearnumber']);
//                if(empty($aResult['result'])){
//                    $aResult['error'] = 'No data found!';
//                }
//            }
//            break;
//        case 'getTotalSensors':
//            $aResult['result'] = get_average_cluster_pm();
//            if(empty($aResult['result'])){
//                $aResult['error'] = 'No data found!';
//            }
//            break;
        default:
            $aResult['error'] = 'Not found function '.$_GET['functionname'].'!';
            break;
    }
    echo json_encode($aResult);
}

//function insert_sensor_location($sensor_id, $lat, $long){
//    $conn = getConnection();
//    $statement = $conn->prepare('insert into sensors (sensor_id, lat, lon) values (:sensor_id, :lat, :lon);');
//    $statement->bindParam(':sensorID', $sensor_id);
//    $statement->bindParam(':lat', $lat);
//    $statement->bindParam(':lon', $long);
//    $statement->execute();
//    $conn = null;
//}
//
//function insert_sensor_pm($sensor_id, $timestamp, $p1, $p2){
//    $conn = getConnection();
//    $statement = $conn->prepare('insert into pmvalues_sensors (sensor_id, ts, P1, P2) values (:sensor_id, :ts, :P1, :P2);');
//    $statement->bindParam(':sensorID', $sensor_id);
//    $statement->bindParam(':ts', $timestamp);
//    $statement->bindParam(':P1', $p1);
//    $statement->bindParam(':P2', $p2);
//    $statement->execute();
//    $conn = null;
//}


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

//function get_sensors_pm($month, $year){
//    $conn = getConnection();
//    $statement = $conn->prepare('SELECT sensors.sensorID, sensors.lat, sensors.lon, x1.P1, x1.P2
//                                            FROM sensors
//                                            INNER JOIN
//                                                (SELECT x.sensorID, x.P1, x.P2
//                                                FROM
//                                                    (SELECT sensorID, SUBSTRING(ts, 1, 4) as _year,
//                                                    SUBSTRING(ts, 6, 2) as _month,
//                                                    P1, P2 FROM pmvalues_sensors) x
//                                                WHERE x._year = :year and x._month = :month) x1
//                                            WHERE sensors.sensorID = x1.sensorID');
//    $statement->setFetchMode(PDO::FETCH_ASSOC);
//    $statement->bindParam(':year', $year);
//    $statement->bindParam(':month', $month);
//    $statement->execute();
//    $result = $statement->fetchAll();
//    $conn = null;
//    return $result;
//}

//function get_clusters_pm($month, $year){
//    $conn = getConnection();
//    $statement = $conn->prepare('SELECT clusters.clusterID, clusters.lat, clusters.lon, clusters.`range`, x1.P1, x1.P2
//                                            FROM clusters
//                                            INNER JOIN
//                                                (SELECT x.clusterID, x.P1, x.P2
//                                                FROM
//                                                    (SELECT clusterID, SUBSTRING(ts, 1, 4) as _year,
//                                                    SUBSTRING(ts, 6, 2) as _month,
//                                                    P1, P2 FROM pmvalues_clusters) x
//                                                WHERE x._year = :year AND x._month = :month) x1
//                                            WHERE clusters.clusterID = x1.clusterID');
//    $statement->setFetchMode(PDO::FETCH_ASSOC);
//    $statement->bindParam(':year', $year);
//    $statement->bindParam(':month', $month);
//    $statement->execute();
//    $result = $statement->fetchAll();
//    $conn = null;
//    return $result;
//}

//function get_specific_cluster_pm($clusterID, $year){
//    $conn = getConnection();
//    $statement = $conn->prepare('SELECT clusterID, SUBSTRING(ts, 6, 2) as _month, P1, P2 FROM pmvalues_clusters WHERE clusterID = :clusterID AND SUBSTRING(ts, 1, 4) = :_year ORDER BY _month ASC ');
//    $statement->setFetchMode(PDO::FETCH_ASSOC);
//    $statement->bindParam(':clusterID', $clusterID);
//    $statement->bindParam(':_year', $year);
//    $statement->execute();
//    $result = $statement->fetchAll();
//    $conn = null;
//    return $result;
//}

//function get_average_cluster_pm(){
//    $conn = getConnection();
//    $statement = $conn->prepare('SELECT clusters.clusterID, clusters.lat, clusters.lon, clusters.`range`, x.P1, x.P2
//                                            FROM clusters INNER JOIN(
//                                                SELECT clusterID, P1, P2
//                                                FROM pmvalues_total_clusters) x
//                                             WHERE clusters.clusterID = x.clusterID');
//    $statement->setFetchMode(PDO::FETCH_ASSOC);
//    $statement->execute();
//    $result = $statement->fetchAll();
//    $conn = null;
//    return $result;
//}

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


