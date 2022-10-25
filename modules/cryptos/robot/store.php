<?php

namespace modules\cryptos\robot;

// Controllers
//use base\core\controller\helpers;

/**
 *
 * @author Dani Gilabert
 * 
 * Static class to store vars and current data in order to feed robots
 * 
 */

class store
{
    // Common
    private static $_candlestick_interval = "15";
    private static $_emulator = false;
    
    // Users
    private static $_users = array();
    private static $_api_rotate_counter = 0;
    
    // Sampling
    private static $_samples = array();
    private static $_date_sample = '';
    private static $_last_sample_ws = array();
    
    // Trading
    private static $_current_robots_values = array();
    private static $_robots_values = array();
    private static $_last_prices = array();
    private static $_db_sample = array();
    private static $_pending_asynchronous_transactions = array();
    private static $_market_coins = array();

    /**
     *
     * Common
     * 
     */  
    public static function isEmulator()
    {
        return self::$_emulator;
    }

    public static function setEmulator($value)
    {
        self::$_emulator = $value;
    }
    
    public static function getCandlestickInterval()
    {
        return self::$_candlestick_interval;
    }

    public static function setCandlestickInterval($value)
    {
        self::$_candlestick_interval = $value;
    }

    /**
     *
     * Users
     * 
     */    
    public static function getAvailableUsers()
    {
        return self::$_users;
    }

    public static function setAvailableUsers($value)
    {
        self::$_users = $value;
    } 
    
    public static function getApiRotateCounter()
    {
        return self::$_api_rotate_counter;
    }

    public static function setApiRotateCounter($value)
    {
        self::$_api_rotate_counter = $value;
    }

    /**
     *
     * Sampling
     * 
     */  
    public static function getSamples()
    {
        return self::$_samples;
    }

    public static function addSample($value)
    {
        self::$_samples[] = $value;
        
        $minutes = 60 * 24; // 24 hours
        $minutes += (60 * 1); // 1 hour more
        if (count(self::$_samples) > $minutes)
        {
            // Remove the first one (FIFO) of x samples
            array_shift(self::$_samples);
        }
    }
    
    public static function getLastSample($ws = false)
    {
        if ($ws)
        {
            return self::$_last_sample_ws;
        }
        else
        {
            return end(self::$_samples);
        }
    }

    public static function setLastSampleWs($value)
    {
        self::$_last_sample_ws = $value;
    }

    public static function getDateSample()
    {
        return self::$_date_sample;
    }

    public static function setDateSample($value)
    {
        self::$_date_sample = $value;
    }

    public static function resetSampling()
    {
        self::$_samples = array();
        self::$_date_sample = '';
        self::$_last_sample_ws = '';
    }

    /**
     *
     * Tradding
     * 
     */ 
    public static function getCurrentRobotsValues()
    {
        return self::$_current_robots_values;
    }

    public static function setCurrentRobotsValues($value)
    {
        self::$_current_robots_values = $value;
    }
    
    public static function getRobotsValues()
    {
        return self::$_robots_values;
    }
    
    public static function getRobotValue($user_code, $robot_code, $property, $index_desc = 0)
    {
        $robots_values = self::getRobotsValues();
        $total_robots_values = count($robots_values);
        
        $index_value_desc = $index_desc + 1;
        if ($total_robots_values < $index_value_desc)
        {
            return null;
        }
        
        $i = $total_robots_values - $index_value_desc;
        if (!isset($robots_values[$i]) || 
            !isset($robots_values[$i][$user_code]) || 
            !isset($robots_values[$i][$user_code][$robot_code]) || 
            !isset($robots_values[$i][$user_code][$robot_code][$property])
        )
        {
            return null;
        }
        $ret = $robots_values[$i][$user_code][$robot_code][$property];
        
        if (strtoupper($ret) === 'NAN')
        {
            return null;
        }
        
        return $ret;
    }

    public static function addRobotsValues($values)
    {
        // Only robot track values (in order to shrink db)
        $robots_values = array();
        foreach ($values as $user_code => $user_values) {
            foreach ($user_values as $robot_code => $robot_values) {
                $robots_values[$user_code][$robot_code] = array(
                    'robot_track_value' => $robot_values['robot_track_value']
                );
            } 
        }
        
        //self::$_robots_values[] = $values;
        self::$_robots_values[] = $robots_values;
        
        $minutes = 60 * 24; // 24 hours
        $minutes += (60 * 1); // 1 hour more
        if (count(self::$_robots_values) > $minutes)
        {
            // Remove the first one (FIFO) of x samples
            array_shift(self::$_robots_values);
        }
    }
    
    public static function getLastPrices()
    {
        return self::$_last_prices;
    }

    public static function setLastPrices($value)
    {
        self::$_last_prices = $value;
    }

    public static function getDbSample()
    {
        return self::$_db_sample;
    }

    public static function setDbSample($value)
    {
        self::$_db_sample = $value;
    }

    public static function resetTrading()
    {
        self::$_current_robots_values = array();
        self::$_robots_values = array();
        self::$_last_prices = array();
        self::$_db_sample = array();
    }

    public static function getPendingAsynchronousTransactions($user_code, $robot_code)
    {
        if (is_null($robot_code))
        {
            if (!isset(self::$_pending_asynchronous_transactions[$user_code]))
            {
                return array();
            }
            return self::$_pending_asynchronous_transactions[$user_code];            
        }
        else
        {
            if (!isset(self::$_pending_asynchronous_transactions[$user_code][$robot_code]))
            {
                return array();
            }
            return self::$_pending_asynchronous_transactions[$user_code][$robot_code];            
        }
    }

    public static function addPendingAsynchronousTransaction($user_code, $robot_code, $transaction)
    {
        $code = $transaction['code'];
        self::$_pending_asynchronous_transactions[$user_code][$robot_code][$code] = $transaction;
    }

    public static function removePendingAsynchronousTransaction($user_code, $robot_code, $transaction)
    {
        $code = $transaction['code'];
        unset(self::$_pending_asynchronous_transactions[$user_code][$robot_code][$code]);
    }

    public static function resetPendingAsynchronousTransactions()
    {
        self::$_pending_asynchronous_transactions = array();
    }

    public static function getMarketCoins($user_code)
    {
        if (!isset(self::$_market_coins[$user_code]))
        {
            return array();
        }
        return self::$_market_coins[$user_code]; 
    }

    public static function setMarketCoins($user_code, $market_coins)
    {
        self::$_market_coins[$user_code] = $market_coins;
    }
    
}
