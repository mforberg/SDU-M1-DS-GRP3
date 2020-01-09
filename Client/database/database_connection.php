<?php
require 'db_functions.php';

$aResult = array();
if( !isset($_GET['functionname']) ) { $aResult['error'] = 'No function name!'; }
if( !isset($aResult['error']) ) {
    switch($_GET['functionname']) {
        case 'getData':
            if(!isset($_GET['monthnumber']) || !isset($_GET['yearnumber'])) {
                $aResult['error'] = 'No function arguments!';
            } else {
                $db_functions = new db_functions();
                $aResult['result']['sensor_location'] = $db_functions->get_sensor_locations($_GET['monthnumber'], $_GET['yearnumber']);
                $aResult['result']['clusters'] = $db_functions->get_clusters($_GET['monthnumber'], $_GET['yearnumber']);
                $aResult['result']['normalize_values'] = $db_functions->get_normalize_values($_GET['monthnumber'], $_GET['yearnumber']);
                if (empty($aResult['result']['sensor_location']) OR empty($aResult['result']['clusters']) OR empty($aResult['result']['normalize_values'])){
                    $aResult['error'] = "No Data Found";
                }
            }
            break;
        case 'updateData':
            $db_functions = new db_functions();
            $db_functions->update_clusters();
            $db_functions->update_sensors();
            $aResult['result'] = "updated";
            break;
        default:
            $aResult['error'] = 'Not found function '.$_GET['functionname'].'!';
            break;
    }
    echo json_encode($aResult);
}
