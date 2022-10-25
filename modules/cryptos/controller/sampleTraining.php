<?php

namespace modules\cryptos\controller;

// Controllers
use modules\cryptos\controller\sample;

/**
 * Sample training controller
 *
 * @author Dani Gilabert
 */
class sampleTraining extends sample
{
    
    public function getSamplesByUserAndRobotAndIntervalAndDate($user_code, $robot_code, $candlestick_interval, $start_date, $end_date)
    {
        $view = $this->model->getView("samplesByUserAndRobotAndIntervalAndDate");
        $view->setStartKey(array($user_code, $robot_code, $candlestick_interval, $start_date));
        $view->setEndKey(array($user_code, $robot_code, $candlestick_interval, $end_date));
        $data = $view->exec()['data'];
        return $data;
    }
    
    
}
