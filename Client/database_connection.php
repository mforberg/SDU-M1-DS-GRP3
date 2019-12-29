<?php
require 'db_config.php';

$aResult = array();
if( !isset($_GET['functionname']) ) { $aResult['error'] = 'No function name!'; }
if( !isset($aResult['error']) ) {
    switch($_GET['functionname']) {
        case 'getData':
            $aResult['result']['sensor_location'] = get_sensor_locations();
            $aResult['result']['cluster_location'] = get_cluster_locations();
            break;
        case 'getClusters':
            if(!isset($_GET['weeknumber']) ) {
                $aResult['error'] = 'No function arguments!';
            } else {
               // insert_data($_GET['arguments'],2.2,2.3, "banan", 2.4,2.5);
                $aResult['result'] = get_cluster_pm($_GET['sensorID'], $_GET['weeknumber']);
            }
            break;
        default:
            $aResult['error'] = 'Not found function '.$_GET['functionname'].'!';
            break;
    }
    echo json_encode($aResult);
}

function insert_sensor_location($sensor_id, $lat, $long){
    $conn = getConnection();
    $statement = $conn->prepare('insert into sensors (sensor_id, lat, lon) values (:sensor_id, :lat, :lon);');
    $statement->bindParam(':sensorID', $sensor_id);
    $statement->bindParam(':lat', $lat);
    $statement->bindParam(':lon', $long);
    $statement->execute();
    $conn = null;
}

function insert_sensor_pm($sensor_id, $timestamp, $p1, $p2){
    $conn = getConnection();
    $statement = $conn->prepare('insert into pmvalues_sensors (sensor_id, ts, P1, P2) values (:sensor_id, :ts, :P1, :P2);');
    $statement->bindParam(':sensorID', $sensor_id);
    $statement->bindParam(':ts', $timestamp);
    $statement->bindParam(':P1', $p1);
    $statement->bindParam(':P2', $p2);
    $statement->execute();
    $conn = null;
}

function get_sensor_locations(){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT * FROM sensors');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return $result;
}

function get_cluster_locations(){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT * FROM clusters');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return $result;
}

function get_sensor_pm($sensorID, $timestamp){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT * FROM pmvalues_sensors WHERE sensorID =:sensorID AND ts =:ts');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindParam(':sensorID', $sensorID);
    $statement->bindParam(':ts', $timestamp);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return $result;
}

function get_cluster_pm($clusterID, $week){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT * FROM pmvalues_clusters WHERE clusterID =:clusterID AND week =:week');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindParam(':clusterID', $clusterID);
    $statement->bindParam(':week', $week);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return $result;
}

