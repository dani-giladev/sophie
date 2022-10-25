<?php

namespace modules\cryptos\robot;

// Controllers
use modules\cryptos\robot\sampling;
use modules\cryptos\controller\sampleTraining;

/**
 *
 * @author Dani Gilabert
 * 
 */

class samplingTraining extends sampling
{    
    private $_user;
    private $_robot;    
    
    public function __construct()
    {
        parent::__construct();
        $this->_sample_controller = new sampleTraining();
    }
    
    public function setCurrentValues($user, $robot)
    {
        $this->_user = $user;
        $this->_robot = $robot;
    }
    
    protected function _getParams($candlestick_interval, $date, $samples, $robots_values)
    {
        $user_code = $this->_user['userdata']['code'];
        $robot_code = $this->_robot['code'];
        
        return array(
            'candlestick_interval' => $candlestick_interval,
            'user_code' => $user_code,
            'robot_code' => $robot_code,
            // Sample values
            'sample_date' => $date,
            'samples_values' => $samples,
            'robots_values' => $robots_values
        );
    }
    
    protected function _getCurrentRobotsValues()
    {
        $ret = array();
        $user_code = $this->_user['userdata']['code'];
        $robot_code = $this->_robot['code'];
        $robots_values[$user_code][$robot_code] = $this->getRobotValues($user_code, $robot_code);
        $ret[$user_code][$robot_code] = $this->_prepareRobotValues($this->_robot, $robots_values[$user_code][$robot_code]);
        return $ret;
    }
    
}
