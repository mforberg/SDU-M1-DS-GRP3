<?php
require 'db_config.php';

$aResult = array();
if( !isset($_GET['functionname']) ) { $aResult['error'] = 'No function name!'; }
if( !isset($aResult['error']) ) {
    switch($_GET['functionname']) {
        case 'getData':
            $aResult['result'] = get_sensor_data();
            break;
        case 'getClusters':
            if(!isset($_GET['weeknumber']) ) {
                $aResult['error'] = 'No function arguments!';
            } else {
               // insert_data($_GET['arguments'],2.2,2.3, "banan", 2.4,2.5);
                $aResult['result'] = get_cluster_data($_GET['weeknumber']);
            }
            break;
        default:
            $aResult['error'] = 'Not found function '.$_GET['functionname'].'!';
            break;
    }
    echo json_encode($aResult);

}




function insert_data($sensor_id, $lat, $long, $timestamp, $p1, $p2){
    $conn = getConnection();
    $statement = $conn->prepare('insert into sofiadata (sensor_id, lat, lon, ts, P1, P2) values (:sensor_id, :lat, :lon, :ts, :P1, :P2);');
    $statement->bindParam(':sensor_id', $sensor_id);
    $statement->bindParam(':lat', $lat);
    $statement->bindParam(':lon', $long);
    $statement->bindParam(':ts', $timestamp);
    $statement->bindParam(':P1', $p1);
    $statement->bindParam(':P2', $p2);

    $statement->execute();
    $conn = null;
}

function get_sensor_data(){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT * FROM sofiadata');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return json_encode($result);
}

function get_cluster_data($week){
    $conn = getConnection();
    $statement = $conn->prepare('SELECT * FROM clusters WHERE week =:week');
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindParam(':week', $week);
    $statement->execute();
    $result = $statement->fetchAll();
    $conn = null;
    return json_encode($result);
}