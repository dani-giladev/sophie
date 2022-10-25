<?php

namespace modules\cryptos\robot;

// Controllers
use base\core\controller\mail;
use modules\cryptos\controller\symbol;
use modules\cryptos\controller\robot;
use modules\cryptos\controller\binance;
use modules\cryptos\controller\sample;
use modules\cryptos\controller\transaction;
use modules\cryptos\controller\transactionTraining;
// Robot
use modules\cryptos\robot\store;

/**
 *
 * @author Dani Gilabert
 * 
 */

class common
{
    // Controllers
    protected $_mail_controller;
    protected $_symbol_controller;
    protected $_robot_controller;
    protected $_binance_controller;
    protected $_sample_controller;
    protected $_transaction_controller;
    // Controllers for training
    protected $_transaction_training_controller;

    public function __construct()
    {
        // Controllers
        $this->_mail_controller = new mail();
        $this->_symbol_controller = new symbol();
        $this->_robot_controller = new robot();
        $this->_binance_controller = new binance();
        $this->_sample_controller = new sample();
        $this->_transaction_controller = new transaction();
        // Controllers for training
        $this->_transaction_training_controller = new transactionTraining();
    }
    
    public function getTransactionController($robot)
    {
        if (!$this->_robot_controller->isTraining($robot) && !store::isEmulator())
        {
            return $this->_transaction_controller;
        }
        else
        {
            return $this->_transaction_training_controller;
        }
    }
    
    public function getApi($user = null)
    {
        if (is_null($user))
        {
            // In order to rotate the connection and don't use always the same
            $user = $this->getNextUser(); 
        }

        return $user['api'];
    }
    
    public function getNextUser()
    {
        $users = store::getAvailableUsers();
        $api_rotate_counter = store::getApiRotateCounter();
        
        $api_rotate_counter++;
        if ($api_rotate_counter > (count($users) - 1))
        {
            $api_rotate_counter = 0;
        }
        
        store::setApiRotateCounter($api_rotate_counter);
        
        $users_by_index = array();
        foreach ($users as $user)
        {
            $users_by_index[] = $user;
        }
        return $users_by_index[$api_rotate_counter];
    }
    
    public function getSymbols()
    {
        $symbols = array();
        
        $users = store::getAvailableUsers();
        foreach ($users as $user)
        {
            $robots = $user['robots'];
            foreach ($robots as $robot)
            {
                if (in_array($robot['coinpair'], $symbols))
                {
                    continue;
                }
                array_push($symbols, $robot['coinpair']);
            }
        }
        
        // Add additional pairs to calculate commissions
        $required_pairs = $this->_symbol_controller->getRequiredSymbols();
        foreach ($required_pairs as $pair)
        {
            if (in_array($pair, $symbols))
            {
                continue;
            }
            array_push($symbols, $pair);
        }
        
        return $symbols;
    }
    
    public function getRobotValues($user_code, $robot_code)
    {
        $robots_values = store::getCurrentRobotsValues();
        return (isset($robots_values[$user_code]) && isset($robots_values[$user_code][$robot_code]))? $robots_values[$user_code][$robot_code] : array();
    }
    
    public function setRobotValues($user_code, $robot_code, $robot_values)
    {
        $values = store::getCurrentRobotsValues();
        $values[$user_code][$robot_code] = $robot_values;
        store::setCurrentRobotsValues($values);
    }
    
    public function getRobotTrackValue($user, $robot)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        if (!empty($robot_values) && isset($robot_values['robot_track_value']))
        {
            $ret = $robot_values['robot_track_value'];
            //$ret = $this->normalizeFloatValue($ret);
        }
        else
        {
            $ret = null;
        }
        return $ret;
    }
    
    public function setRobotTrackValue($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['robot_track_value'] = (string) $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getLowestValue($user, $robot)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        if (!empty($robot_values) && isset($robot_values['lowest_value']))
        {
            $ret = $robot_values['lowest_value'];
            //$ret = $this->normalizeFloatValue($ret);
        }
        else
        {
            $ret = $this->getRobotTrackValue($user, $robot);
        }
        return $ret;
    }
    
    public function setLowestValue($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['lowest_value'] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getHighestValue($user, $robot)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        if (!empty($robot_values) && isset($robot_values['highest_value']))
        {
            $ret = $robot_values['highest_value'];
            //$ret = $this->normalizeFloatValue($ret);
        }
        else
        {
            $ret = $this->getRobotTrackValue($user, $robot);
        }
        return $ret;
    }
    
    public function setHighestValue($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['highest_value'] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getLastTransaction($user, $robot, $operation)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        return (!empty($robot_values) && isset($robot_values['last_transaction']) && isset($robot_values['last_transaction'][$operation]))? $robot_values['last_transaction'][$operation] : array();
    }
                
    public function setLastTransaction($user, $robot, $operation, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['last_transaction'][$operation] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getBuyingPrices($user, $robot)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        
        if (!empty($robot_values) && isset($robot_values['buying_prices']))
        {
            $buying_prices = $robot_values['buying_prices'];
        }
        else
        {
            $last_transaction = $this->getLastTransaction($user, $robot, 'buy');
            $price = $last_transaction['price'];
            //$price = $this->normalizeFloatValue($price);
            $robot_track_value = $last_transaction['robot_track_value'];
            //$robot_track_value = $this->normalizeFloatValue($robot_track_value);
            $buying_prices = array(
                'price' => $price,
                'robot_track_value' => $robot_track_value
            );
            $this->setBuyingPrices($user, $robot, $buying_prices);
        }
        
        return $buying_prices;
    }
    
    public function setBuyingPrices($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['buying_prices'] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getSellingPrice($user, $robot)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        
        if (!empty($robot_values) && isset($robot_values['selling_price']))
        {
            $selling_price = $robot_values['selling_price'];
        }
        else
        {
            $last_transaction = $this->getLastTransaction($user, $robot, 'sell');
            if (empty($last_transaction))
            {
                return null;
            }
            $selling_price = $last_transaction['price'];
        }
        
        //$selling_price = $this->normalizeFloatValue($selling_price);
        return $selling_price;
    }
    
    public function setSellingPrice($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['selling_price'] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getLastPrices($user, $robot)
    {
        $last_prices = store::getLastPrices();
        if (empty($last_prices))
        {
            if (store::isEmulator())
            {
                $last_prices = $this->getPricesOfLastSample(true);
            }
            else
            {
                if (
                        is_null($user) || 
                        !$this->_robot_controller->isTraining($robot) || 
                        $this->_robot_controller->getTrainingMode($robot) === 'real-time')
                {
                    $last_prices = $this->_binance_controller->getLastPrices($this->getApi($user));
                }
                else
                {
                    $last_prices = $this->getPricesOfLastSample(true);
                }
            }
            store::setLastPrices($last_prices);
        }
        return $last_prices;
    }
    
    public function resetLastPrices($value)
    {
        store::setLastPrices($value);
    }
    
    public function getLastPrice($user, $robot)
    {
        $last_prices = $this->getLastPrices($user, $robot);
        
        $coinpair = $robot['coinpair'];
        $last_price =  $last_prices[$coinpair];
        
        //$last_price = $this->normalizeFloatValue($last_price);
        return $last_price;
    }
    
    public function getPrice($sample, $coinpair)
    {
        $ret = $sample[$coinpair]['close'];
        //$ret = $this->normalizeFloatValue($ret);
        return $ret;
    }
    
    public function getPriceOfLastSample($robot, $ws = false)
    {
        $sample = store::getLastSample($ws);
        return $this->getPrice($sample, $robot['coinpair']);
    }
    
    public function getPricesOfLastSample($ws = false)
    {
        $last_prices = array();
        
        $sample = store::getLastSample($ws);
        foreach ($sample as $coinpair => $values)
        {
            $last_prices[$coinpair] = $this->getPrice($sample, $coinpair);
        }
        
        return $last_prices;
    }
    
    public function getVolume($sample, $coinpair)
    {
        $ret = $sample[$coinpair]['volume'];
        //$ret = $this->normalizeFloatValue($ret);
        return $ret;
    }
    
    public function getVolumeOfLastSample($robot, $ws = false)
    {
        $sample = store::getLastSample($ws);
        return $this->getVolume($sample, $robot['coinpair']);
    }
    
    public function isGreenCandle($sample, $coinpair)
    {
        return ($sample[$coinpair]['close'] >= $sample[$coinpair]['open']);
    }
    
    public function isGreenCandleOnLastSample($robot)
    {
        $sample = store::getLastSample();
        return $this->isGreenCandle($sample, $robot['coinpair']);
    }
    
    public function getGreenCandle($sample, $coinpair)
    {
        return ($sample[$coinpair]['close'] - $sample[$coinpair]['open']);
    }
    
    public function getGreenCandleOnLastSample($robot)
    {
        $sample = store::getLastSample();
        return $this->getGreenCandle($sample, $robot['coinpair']);
    }
    
    public function getSamples($user, $robot)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        return (!empty($robot_values) && isset($robot_values['samples']))? $robot_values['samples'] : array();
    }
    
    public function addSample($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['samples'][] = $value;
        
        $filter_factor = $this->getRobotValue($user, $robot, 'filter_factor');
        $number_of_samples_to_remove = count($robot_values['samples']) - $filter_factor;
        if ($number_of_samples_to_remove > 0)
        {
            $robot_values['samples'] = array_slice($robot_values['samples'], $number_of_samples_to_remove); 
        }        
        
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function setSamples($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['samples'] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getRobotValue($user, $robot, $property)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        return (!empty($robot_values) && isset($robot_values[$property]))? $robot_values[$property] : ($this->_robot_controller->getValue($robot, $property));
    }
    
    public function setRobotValue($user, $robot, $property, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values[$property] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function getFilterValues($user, $robot, $filter_key)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        if ((!empty($robot_values) && isset($robot_values[$filter_key.'_filter_values'])))
        {
            $ret = $robot_values[$filter_key.'_filter_values'];
        }
        else
        {
            $ret = $this->_robot_controller->getFilterValues($robot, $filter_key);
            $ret['filter_value'] = null;
        }
        
        return $ret;
    }
    
    public function setFilterValues($user, $robot, $filter_key, $filter_values)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values[$filter_key.'_filter_values'] = $filter_values;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function setFilterPosition($user, $robot, $filter_key, $position, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $key = $filter_key.'_filter_is_'.$position;
        $robot_values[$key] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function isFilterCrossed($user, $robot, $filter_key)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $key1 = $filter_key.'_filter_is_above';
        $key2 = $filter_key.'_filter_is_below';
        if (empty($robot_values) || !isset($robot_values[$key1]) || !isset($robot_values[$key2]))
        {
            return false;
        }
        return ($robot_values[$key1] && $robot_values[$key2]);
    }
    
    public function setRSISignalBelow($user, $robot, $value)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        $robot_values['rsi_signal_below'] = $value;
        $this->setRobotValues($user['userdata']['code'], $robot['code'], $robot_values);
    }
    
    public function hasRSISignalBeenBelow($user, $robot)
    {
        $robot_values = $this->getRobotValues($user['userdata']['code'], $robot['code']);
        return (!empty($robot_values) && isset($robot_values['rsi_signal_below']))? $robot_values['rsi_signal_below'] : false;
    }
    
    public function getAmount($robot, $operation, $last_transaction, $last_prices)
    {
        if (empty($last_transaction))
        {
            $amount = $this->_robot_controller->getAmount($robot, $last_prices);
            return $amount;
        }
        
        if ($operation === 'sell')
        {
            //return $last_transaction['amount'];
            return $this->_robot_controller->normalizeAmount($robot, $last_transaction['amount']);
        }
        
        /*if ($this->_robot_controller->isAsynchronous($robot))
        {
            // Asynchronous
            
 
            
        }
        else*/if ($this->_robot_controller->isRedAndWhite($robot))
        {
            // Red & white
            
            if ($last_transaction['total_profit'] > 0)
            {
                $amount = $this->_robot_controller->getAmount($robot, $last_prices);
                return $amount;
            }

            if (isset($robot['rw_max_consecutive_failures']) && $robot['rw_max_consecutive_failures'] > 0)
            {
                $amount = $this->_robot_controller->getAmount($robot, $last_prices);
                $max_amount = $amount * $robot['rw_max_consecutive_failures'];
                if ($last_transaction['amount'] > $max_amount)
                {
                    return $amount;
                }
            }

            $double_amount = $last_transaction['amount'] * 2;
            $ret = $this->_robot_controller->normalizeAmount($robot, $double_amount);
            return $ret;
            
        }
        
        $amount = $this->_robot_controller->getAmount($robot, $last_prices);
        return $amount;
    }
    
    public function normalizeFloatValue($value)
    {
        $new_value = str_replace(",", ".", $value);
        if (!is_numeric($new_value))
        {
            return "NAN";
        }
        $ret = (float) $value;
        return $ret;
    }
    
}
