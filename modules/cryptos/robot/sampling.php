<?php

namespace modules\cryptos\robot;

// Controllers
use modules\cryptos\robot\common;
use modules\cryptos\robot\store;

/**
 *
 * @author Dani Gilabert
 * 
 */

class sampling extends common
{
    
    public function saveSample()
    {                
        $candlestick_interval = store::getCandlestickInterval();
        $date = store::getDateSample();
        $samples = store::getLastSample();
        $robots_values = $this->_getCurrentRobotsValues();
        
        $params = $this->_getParams($candlestick_interval, $date, $samples, $robots_values);
        
        // Add sample
        $this->_sample_controller->save($params);      
    }
    
    protected function _getParams($candlestick_interval, $date, $samples, $robots_values)
    {
        return array(
            'candlestick_interval' => $candlestick_interval,
            // Sample values
            'sample_date' => $date,
            'samples_values' => $samples,
            'robots_values' => $robots_values
        );
    }
    
    protected function _getCurrentRobotsValues()
    {
        $ret = array();
        $robots_values = store::getCurrentRobotsValues();
        
        $users = store::getAvailableUsers();
        foreach ($users as $user_code => $user)
        {     
            foreach ($user['robots'] as $robot_code => $robot)
            {
                $ret[$user_code][$robot_code] = $this->_prepareRobotValues($robot, $robots_values[$user_code][$robot_code]);
            }
        }
        
        return $ret;
    }
    
    protected function _prepareRobotValues($robot, $robot_values)
    {
        //unset($robot_values['samples']);
        //$robot_values['coinpair'] = $robot['coinpair'];
        return array(
            'robot_track_value' => $robot_values['robot_track_value']
        );
    }
    
}
