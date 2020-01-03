<?php
require 'db_config.php';

$aResult = array();
if( !isset($_GET['functionname']) ) { $aResult['error'] = 'No function name!'; }
if( !isset($aResult['error']) ) {
    switch($_GET['functionname']) {
        case 'getLocationData':
            $aResult['result']['sensor_location'] = get_sensor_locations();
            $aResult['result']['cluster_location'] = get_cluster_locations();
            if(empty($aResult['result']['sensor_location']) || empty($aResult['result']['cluster_location'])){
                $aResult['error'] = 'No data found!';
            }
            break;
        case 'getClusters':
            if(!isset($_GET['weeknumber'])) {
                $aResult['error'] = 'No function arguments!';
            } else {
                $aResult['result'] = get_clusters_pm($_GET['weeknumber']);
                if(empty($aResult['result'])){
                    $aResult['error'] = 'Sensor ID or week number not right!';
                }
            }
            break;
        case 'getSpecificCluster':
            if(!isset($_GET['weeknumber']) || !isset($_GET['clusterID'])) {
                $aResult['error'] = 'No function arguments!';
            } else {
                $aResult['result'] = get_specific_cluster_pm($_GET['clusterID'], $_GET['weeknumber']);
                if(empty($aResult['result'])){
                    $aResult['error'] = 'Sensor ID or week number not right!';
                }
            }
            break;
        case 'getSensors':
            if(!isset($_GET['weeknumber'])) {
                $aResult['error'] = 'No function arguments!';
            } else {
                $aResult['result'] = get_sensors_pm($_GET['weeknumber']);
                if(empty($aResult['result'])){
                    $aResult['error'] = 'No data found!';
                }
            }
            break;
        case 'getTotalSensors':
            $aResult['result'] = get_average_cluster_pm();
            if(empty($aResult['result'])){
                $aResult['error'] = 'No data found!';
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

function get_sensors_pm($week){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT sensors.sensorID, sensors.lat, sensors.lon, x.P1, x.P2 
                                            FROM sensors INNER JOIN(
                                                SELECT sensorID, P1, P2 
                                                FROM pmvalues_sensors 
                                                where pmvalues_sensors.week = :week) x 
                                            WHERE sensors.sensorID = x.sensorID');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindParam(':week', $week);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return $result;
}

function get_clusters_pm($week){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT clusters.clusterID, clusters.lat, clusters.lon, clusters.`range`, x.P1, x.P2 
                                            FROM clusters INNER JOIN(
                                                SELECT clusterID, P1, P2 
                                                FROM pmvalues_clusters 
                                                where pmvalues_clusters.week = :week) x 
                                            WHERE clusters.clusterID = x.clusterID');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindParam(':week', $week);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return $result;
}

function get_specific_cluster_pm($clusterID, $week){
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

function get_average_cluster_pm(){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT pmvalues_total_clusters.clusterID, x.lat, x.lon, x.`range`, 
                                            pmvalues_total_clusters.P1, pmvalues_total_clusters.P2 
                                            FROM pmvalues_total_clusters INNER JOIN(
                                                SELECT lat, lon, `range` 
                                                FROM clusters
                                                ) x 
                                            WHERE pmvalues_total_clusters.clusterID = x.clusterID');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return $result;
}

