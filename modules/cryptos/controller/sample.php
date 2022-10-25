<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;

/**
 * Sample controller
 *
 * @author Dani Gilabert
 */
class sample extends controller
{
    private $_codes = array();
    
    protected function _getSamplesByIntervalAndDateView()
    {
        return $this->model->getView("samplesByIntervalAndDate");
    }
     
    public function getSamples($candlestick_interval, $start_date, $end_date, $order = 'ASC', $limit = null, $skip = null)
    {
        $view = $this->_getSamplesByIntervalAndDateView();
        $view->setStartKey(array($candlestick_interval, $start_date));
        $view->setEndKey(array($candlestick_interval, $end_date));            

        if ($order == 'DESC')
        {
            $view->setDescending(true);
        }

        if (isset($limit))
        {
            $view->setLimit($limit);
        }
        if (isset($skip))
        {
            $view->setSkip($skip);
        }  
        
        $data = $view->exec()['data'];
        
        return $data;
    }
    
    public function getFirstSample($candlestick_interval)
    {
        return $this->getLastSample($candlestick_interval, false);
    }
    
    public function getLastSample($candlestick_interval, $descending = true)
    {
        $view = $this->model->getView("samplesByInterval");
        $view->setKey(array($candlestick_interval));
        $view->setLimit("1");
        $view->setDescending($descending);
        $data = $view->exec()['data'];       
        
        if (empty($data))
        {
            return array();
        }
        
        return $data[0];
    }  
    
    public function getSample($candlestick_interval, $date)
    {
        $minutes = $candlestick_interval * 5;
        $end_date = date('Y-m-d H:i:s', strtotime("+$minutes minutes", strtotime($date))); // Get x minutes more to increase the possibilities to find one
        $sample = $this->getSamples($candlestick_interval, $date, $end_date);
        if (empty($sample))
        {
            return array();
        }
        return $sample[0];
    }
    
    public function save($params)
    {
        $candlestick_interval = $params['candlestick_interval'];
        $date = $params['sample_date'];
        $samples = $params['samples_values'];
        $robots_values = $params['robots_values'];
        
        // Add sample
        $code = $this->_getNewCode();
        $id = $this->normalizeId($this->model->type.'-'.$code);   

        // Main
        $doc = array();
        $doc['code'] = $code;
        $doc['candlestick_interval'] = $candlestick_interval;
        
        // Training
        if (isset($params['user_code']))
        {
            $doc['user_code'] = $params['user_code'];
        }
        if (isset($params['robot_code']))
        {
            $doc['robot_code'] = $params['robot_code'];
        }
        
        // Sample values
        $doc['sample_date'] = $date;
        $doc['samples_values'] = $samples;
        $doc['robots_values'] = $robots_values;
        
        // Users snapshot
        if (isset($params['users']))
        {
            $doc['users'] = $params['users'];
        }

        // Date/Time
        $doc['date'] = date("Y-m-d");
        $doc['time'] = date("H:i:s");
        $doc['date_time'] = date("Y-m-d H:i:s");

        // Save
        $this->model->save($id, $doc);       
    }
    
    protected function _getNewCode()
    {
        //return date("YmdHis")."-".rand(100, 999);
        do {
            $t = microtime(true);
            //$micro = sprintf("%06d",($t - floor($t)) * 1000000);
            $micro = str_replace(".", "", $t);
            $code = date("YmdHis")."-".$micro;
            if (in_array($code, $this->_codes))
            {
                usleep(0.5 * 1000 * 1000);
                continue;
            }
            array_push($this->_codes, $code);
            return $code;
        } while (true);
    }
    
}
