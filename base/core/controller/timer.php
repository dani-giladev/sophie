<?php

namespace base\core\controller;

/**
 * Timer class
 *
 * @author Dani Gilabert
 * 
 */
class timer
{
    private $_start_time = 0;
    private $_total_time = 0;
    private $_max_time = 0;

    public function __construct($max_time = 0)
    {
        $this->_start_time = microtime(true);
        $this->_total_time = 0;
        $this->_max_time = $max_time; //seconds
    }
    
    public function isExceeded()
    {
        $this->_updateTotalTime();
        
        if($this->_total_time < $this->_max_time || $this->_max_time == 0)
        {
            return false;
        }        
        else
        {
            return true;
        }
    }
    
    private function _updateTotalTime()
    {
        $current_time = microtime(true);
        $this->_total_time = $current_time - $this->_start_time; 
    }
    
    public function getCurrentTime()
    {
        return microtime(true); 
    }
    
    public function getTotalTime()
    {
        $this->_updateTotalTime();
        return $this->_total_time; 
    }
    
    public function restart()
    {
        $this->_start_time = microtime(true);
        $this->_total_time = 0;
    }

}
