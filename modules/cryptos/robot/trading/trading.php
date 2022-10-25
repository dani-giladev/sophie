<?php

namespace modules\cryptos\robot\trading;

// Controllers
use modules\cryptos\robot\common;
use modules\cryptos\robot\trading\strategies\basicMode;
use modules\cryptos\robot\trading\strategies\macd;
use modules\cryptos\robot\trading\strategies\rsi;
// Robot
use modules\cryptos\robot\store;

/**
 *
 * @author Dani Gilabert
 * 
 */

class trading extends common
{
    private $_user;
    private $_robot;
    // Controllers
    private $_strategy_controller = null;
    private $_strategy_basicmode_controller = null;
    private $_strategy_macd_controller = null;
    private $_strategy_rsi_controller = null;
    
    public function trade($user, $robot)
    {
        $this->_user = $user;
        $this->_robot = $robot;

        if (!$this->_checkBasicRequirements())
        {
            return false;
        }

        // Execute manual operations
        $manual_ret = $this->manualProcess();
        if ($manual_ret !== false)
        {
            return $manual_ret;
        }

        // Automatic or robotic process
        return $this->_automaticProcess();
    }
    
    private function _checkBasicRequirements()
    {
        // Is robot running?
        if (!$this->_robot_controller->isRunning($this->_robot))
        {
            return false;
        }
        
        return true;
    }
    
    private function manualProcess()
    {
        if ($this->_robot_controller->isTrainingInModeHistory($this->_robot))
        {
            return false;
        }
                
        if ($this->_robot_controller->getManualOperation($this->_robot) === 'buy')
        {
            return $this->_buy(true);
        }
        
        if ($this->_robot_controller->getManualOperation($this->_robot) === 'sell' || 
            $this->_robot_controller->getManualOperation($this->_robot) === 'sellAndStop')
        {
            return $this->_sell(true);
        }
        
        return false;
    }
    
    private function _automaticProcess()
    {    
        // Get robot strategy
        $strategy = $this->_robot_controller->getValue($this->_robot, 'strategy');
        
        // Select strategy
        switch ($strategy) {
            case 'macd':
                if (is_null($this->_strategy_macd_controller))
                {
                    $this->_strategy_macd_controller = new macd();
                }
                $this->_strategy_controller = $this->_strategy_macd_controller;
                break;
                
            case 'rsi':
                if (is_null($this->_strategy_rsi_controller))
                {
                    $this->_strategy_rsi_controller = new rsi();
                }
                $this->_strategy_controller = $this->_strategy_rsi_controller;
                break;

            default:
                if (is_null($this->_strategy_basicmode_controller))
                {
                    $this->_strategy_basicmode_controller = new basicMode();
                }
                $this->_strategy_controller = $this->_strategy_basicmode_controller;
                break;
        }
        
        // Init strategy
        $this->_strategy_controller->setCurrentValues($this->_user, $this->_robot);
        
        // Check requirements
        $ret_check = $this->_strategy_controller->getRequirements();
        $buy_is_allowed = $ret_check['buy_is_allowed'];
        $sell_is_allowed = $ret_check['sell_is_allowed'];
        
        // Is time to buy?
        if ($buy_is_allowed)
        {
            $is_time_to_buy = $this->_strategy_controller->isTimeToBuy();
            if ($is_time_to_buy)
            {
                return $this->_buy();
            }            
        }

        // Is time to sell?
        if ($sell_is_allowed)
        {
            $is_time_to_sell = $this->_strategy_controller->isTimeToSell();
            if ($is_time_to_sell)
            {
                if ($this->_robot_controller->isAsynchronous($this->_robot))
                {
                    if ($this->_strategy_controller->isStoploss())
                    {
                        return $this->_setLastOperationInOrderToBuyAgain();
                    }
                    $asynchronous_transaction = $this->_strategy_controller->getAsynchronousTransaction();
                    return $this->_sell(false, $asynchronous_transaction);
                }
                return $this->_sell(false);
            }            
        }
        
        // Check if it's time to disable buy
        $disable_buying_ret = $this->_disableBuying($this->_robot);
        if ($disable_buying_ret !== false)
        {
            return $disable_buying_ret;
        }
        
        return false;       
    }
    
    private function _disableBuying($robot, $operation = null)
    {     
        if ($this->_robot_controller->isTraining($robot) || store::isEmulator())
        {
            return false;
        }
        
        $disable_buying_ret = $this->_strategy_controller->isTimeToDisableBuying($operation);
        if ($disable_buying_ret === false)
        {
            return false;
        }
        
        // Update robot
        $robot_id = $robot['_id'];
        $robot_doc = $this->_robot_controller->get($robot_id)['data'];
        $robot_doc['enabled_to_buy'] = false;
        $robot_doc['buying_deactivation_date'] = date('Y-m-d H:i:s');
        $robot_doc['buying_deactivation_price'] = $this->getLastPrice($this->_user, $this->_robot);
        $ret_save = $this->_robot_controller->model->save($robot_id, $robot_doc);
        
        // Set robot
        $robot['enabled_to_buy'] = $robot_doc['enabled_to_buy'];
        $robot['buying_deactivation_date'] = $robot_doc['buying_deactivation_date'];
        $robot['buying_deactivation_price'] = $robot_doc['buying_deactivation_price'];

        $due_to = $disable_buying_ret['due_to'];
        if ($due_to === 'change_time')
        {
            $change_time = $disable_buying_ret['change_time'];
            $change = $disable_buying_ret['change'];
            $change_max_disable_buy = $disable_buying_ret['change_max_disable_buy'];
            $email_body = 
                "Change time: ".$change_time."h."."</br>".
                "Change: ".$change."%"."</br>".
                "Change max disable buy: ".$change_max_disable_buy."%";
        }
        elseif ($due_to === 'disable_buying_when_sell')
        {
            $email_body = "< SELL and Disable buying >";
        }
        elseif ($due_to === 'disable_buying_when_buy')
        {
            $email_body = "< BUY and Disable buying >";
        }
        else
        {
            $email_body = "< I don't Known why!! >";
        }

        $email_ret = $this->_sendEmail(
            "Buying disabled: ".$robot['name']." (".$robot['coinpair_name'].")",
            $email_body
        ); 

        return array(
            'transaction' => array(),
            'robot' => $robot
        );           
    }
    
    private function _buy($is_manual_operation = false)
    {
        // Buy!
        $operation = 'buy';
        $order = array();
        $last_transaction = $this->getLastTransaction($this->_user, $this->_robot, 'sell');
        $last_prices = $this->getLastPrices($this->_user, $this->_robot);
        $amount = $this->getAmount($this->_robot, $operation, $last_transaction, $last_prices);
        
        if (!$this->_robot_controller->isTraining($this->_robot) && !store::isEmulator())
        {
            $order = $this->_binance_controller->buy($this->getApi($this->_user), $this->_robot['coinpair'], $amount);
            if (!isset($order['orderId']))
            {
                $msg = $order['code']." ".$order['msg'];
                $email_ret = $this->_sendEmail(
                    "Error buying ".$this->_robot['coinpair_name'],
                    "Error executing order to Binance. Error: ".$msg."</br></br>".
                    "Robot: ".$this->_robot['name']." (".$this->_robot['code'].")"
                );
            }
                
            /*  
            // Hunting the bug...
            $robot_code = $this->_robot['code'];
            switch ($robot_code) {
                case 'bchsv-60':
                case 'ltc-60':
                case 'bat-60':
                case 'wall-e-60':
                case 'vet-60':
                case 'civic-60':
                    $json_robot = json_encode($this->_robot, JSON_PRETTY_PRINT);
                    $filename = '/opt/tmp/buying-'.$robot_code.'-'.date('YmdHis');
                    file_put_contents($filename, $json_robot);
                    break;

                default:
                    break;
            }
            */
        }       
        
        // Set buying price
        $real_value = $this->getLastPrice($this->_user, $this->_robot);
        $robot_track_value = $this->getRobotTrackValue($this->_user, $this->_robot);
        $this->setBuyingPrices($this->_user, $this->_robot, array(
            'price' => $real_value,
            'robot_track_value' => $robot_track_value
        ));
        
        // Reset in order to start the selling process
        $this->_resetSellingValues();
        
        // Add transaction
        $ret = $this->_addTransaction($operation, $is_manual_operation, $order, $last_transaction, $amount, $last_prices);

        // Check if it's time to disable buy
        $disable_buying_ret = $this->_disableBuying($ret['robot'], 'buy');
        if ($disable_buying_ret !== false)
        {
            $ret['robot'] = $disable_buying_ret['robot'];
        }
        
        return $ret;
    }
    
    private function _resetBuyingValues()
    {
        $this->setLowestValue($this->_user, $this->_robot, null);
        $this->setHighestValue($this->_user, $this->_robot, null);
        $this->setFilterPosition($this->_user, $this->_robot, 'ma', 'above', false);
        $this->setFilterPosition($this->_user, $this->_robot, 'ma', 'below', false);
        $this->setRobotValue($this->_user, $this->_robot, 'macd_lowest_value', 0);
        $this->setRobotValue($this->_user, $this->_robot, 'macd_divergence_status', 0);
        $this->setRSISignalBelow($this->_user, $this->_robot, false);
    }
    
    private function _sell($is_manual_operation = false, $asynchronous_transaction = null)
    {
        // Sell!
        $operation = 'sell';
        $order = array();
        $is_asynchronous_transaction = (!is_null($asynchronous_transaction));
        $last_transaction = $is_asynchronous_transaction? $asynchronous_transaction : $this->getLastTransaction($this->_user, $this->_robot, 'buy');
        $last_prices = $this->getLastPrices($this->_user, $this->_robot);
        $amount = $this->getAmount($this->_robot, $operation, $last_transaction, $last_prices);
                
        if (!$this->_robot_controller->isTraining($this->_robot) && !store::isEmulator())
        {
            $order = $this->_binance_controller->sell($this->getApi($this->_user), $this->_robot['coinpair'], $amount);
            if (!isset($order['orderId']))
            {
                $msg = $order['code']." ".$order['msg'];
                $email_ret = $this->_sendEmail(
                    "Error selling ".$this->_robot['coinpair_name'],
                    "Error executing order to Binance. Error: ".$msg."</br></br>".
                    "Robot: ".$this->_robot['name']." (".$this->_robot['code'].")"
                );
            }
        }
        
        if (!$is_asynchronous_transaction)
        {
            // Set selling price
            $real_value = $this->getLastPrice($this->_user, $this->_robot);
            $this->setSellingPrice($this->_user, $this->_robot, $real_value);

            // Reset in order to start the buying process
            $this->_resetBuyingValues();            
        }
        else
        {
            $this->_completeAsynchronousTransaction($asynchronous_transaction);
        }       
        
        // Add transaction
        $ret = $this->_addTransaction($operation, $is_manual_operation, $order, $last_transaction, $amount, $last_prices, $is_asynchronous_transaction); 

        // Check if it's time to disable buy
        $disable_buying_ret = $this->_disableBuying($ret['robot'], 'sell');
        if ($disable_buying_ret !== false)
        {
            $ret['robot'] = $disable_buying_ret['robot'];
        }
        
        return $ret;
    }
    
    // Asynchronous
    private function _setLastOperationInOrderToBuyAgain()
    {
        $operation = 'sell';
        
        // Reset in order to start the buying process
        $this->_resetBuyingValues();
        
        /// Mark last buying as asynchronous and not completed
        $last_transaction = $this->getLastTransaction($this->_user, $this->_robot, 'buy');
        if ($this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            $transaction_doc = $last_transaction;
            $transaction_doc['asynchronous'] = true;
            $transaction_doc['completed'] = false;
        }
        else
        {
            $transaction_controller = $this->getTransactionController($this->_robot);
            $transaction_id = $last_transaction['_id'];
            $transaction_doc = $transaction_controller->model->get($transaction_id)['data'];
            $transaction_doc['asynchronous'] = true;
            $transaction_doc['completed'] = false;
            // Save transaction
            $transaction_controller->model->save($transaction_id, $transaction_doc);            
        }

        // Add pending asynchronous transaction
        store::addPendingAsynchronousTransaction($this->_user['userdata']['code'], $this->_robot['code'], $transaction_doc);
        
        // Update robot
        $robot = $this->_robot;
        if ($this->_robot_controller->isTrainingInModeHistory($this->_robot) || $this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            // Update robot
            $robot['last_operation'] = $operation;
            $robot['manual_operation'] = '';
        }
        else
        {
            // Update robot
            $robot_id = $robot['_id'];
            $robot_doc = $this->_robot_controller->get($robot_id)['data'];
            $robot_doc['last_operation'] = $operation;
            $robot_doc['manual_operation'] = '';
            $ret_save = $this->_robot_controller->model->save($robot_id, $robot_doc);
            $robot['last_operation'] = $operation;
            $robot['manual_operation'] = '';
        }
        
        $this->setLastTransaction($this->_user, $robot, 'buy', $transaction_doc);
        
        return array(
            'transaction' => array(),
            'robot' => $robot
        );        
    }
    // Complete async. buying transaction
    private function _completeAsynchronousTransaction($asynchronous_transaction)
    {
        if ($this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            $transaction_doc = $asynchronous_transaction;
            $transaction_doc['completed'] = true;
        }
        else
        {
            $transaction_controller = $this->getTransactionController($this->_robot);
            $transaction_id = $asynchronous_transaction['_id'];
            $transaction_doc = $transaction_controller->model->get($transaction_id)['data'];
            $transaction_doc['completed'] = true;
            // Save transaction
            $transaction_controller->model->save($transaction_id, $transaction_doc);              
        }
        
        // Remove pending asynchronous transaction
        store::removePendingAsynchronousTransaction($this->_user['userdata']['code'], $this->_robot['code'], $transaction_doc);
    }
    
    private function _resetSellingValues()
    {
        $this->setHighestValue($this->_user, $this->_robot, null);
    }
    
    private function _addTransaction($operation, $is_manual_operation, $order, $last_transaction, $amount, $last_prices, $is_asynchronous_transaction = false)
    {
        $robot_track_value = $this->getRobotTrackValue($this->_user, $this->_robot);
        $market_coins = store::getMarketCoins($this->_user['userdata']['code']);

        // Add new transaccion
        return $this->getTransactionController($this->_robot)->save(array(
            // Main
            'user' => $this->_user,
            'robot' => $this->_robot,
            // Trading
            'operation' => $operation,
            'is_manual_operation' => $is_manual_operation,
            'prices' => $last_prices,
            'robot_track_value' => $robot_track_value,
            'order' => $order,
            'last_transaction' => $last_transaction,
            'amount' => $amount,
            'is_asynchronous_transaction' => $is_asynchronous_transaction,
            'market_coins' => $market_coins
        )); 
    }
    
    private function _sendEmail($subject, $body, $send_to_admin = false)
    {
        if ($send_to_admin)
        {
            $email_ret1 = $this->_mail_controller->sendToAdmin($subject, $body);
        }
        
        if (!empty($this->_user['userdata']['email']))
        {
            $to = array(
                $this->_user['userdata']['name'] => $this->_user['userdata']['email']
            ) ;
            $email_ret2 = $this->_mail_controller->sendEmail($to, $subject, $body);
        }
    }
        
}
