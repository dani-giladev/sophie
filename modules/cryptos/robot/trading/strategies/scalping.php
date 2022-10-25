<?php

namespace modules\cryptos\robot\trading\strategies;

// Controllers
use modules\cryptos\robot\common;
use modules\cryptos\robot\store;

/**
 *
 * @author Dani Gilabert
 * 
 */

class scalping extends common
{
    protected $_user;
    protected $_user_code;
    protected $_robot;
    protected $_robot_code;
    protected $_robot_track_value;
    // General parameters
    protected $_candlestick_interval;
    // Buying parameters
    protected $_takeoff;
    protected $_min_green_candle_size;
    protected $_number_of_samples_with_price_always_going_up;
    protected $_change_min;
    protected $_change_max;
    protected $_change_max_disable_buy;
    protected $_change_time;
    protected $_perc_price_vs_robot_track;
    protected $_perc_skip_buying_if_price_is_close_to_last_selling;
    // Selling parameters
    protected $_takeprofit;
    protected $_takeprofit_trailing;
    protected $_takeprofit2;
    protected $_takeprofit2_trailing;
    protected $_stoploss;
    
    // Aux vars
    protected $_is_stoploss;
    protected $_is_takeprofit;
    protected $_profit;
    protected $_asynchronous_transaction;    
    
    protected function _setCurrentValues($user, $robot)
    {
        $this->_user = $user;
        $this->_user_code = $this->_user['userdata']['code'];
        $this->_robot = $robot;
        $this->_robot_code = $robot['code'];
        
        $this->_robot_track_value = $this->getRobotTrackValue($this->_user, $this->_robot);
        
        // General parameters
        $this->_candlestick_interval = $this->_robot_controller->getValue($this->_robot, 'candlestick_interval');
        // Buying parameters
        $this->_takeoff = $this->_robot_controller->getValue($this->_robot, 'takeoff');
        //$this->_takeoff = $this->normalizeFloatValue($this->_takeoff);
        $this->_min_green_candle_size = $this->_robot_controller->getValue($this->_robot, 'min_green_candle_size');
        $this->_number_of_samples_with_price_always_going_up = $this->_robot_controller->getValue($this->_robot, 'number_of_samples_with_price_always_going_up');
        $this->_change_min =  $this->_robot_controller->getValue($this->_robot, 'change_min');
        $this->_change_max = $this->_robot_controller->getValue($this->_robot, 'change_max');
        $this->_change_max_disable_buy = $this->_robot_controller->getValue($this->_robot, 'change_max_disable_buy');
        $this->_change_time = $this->_robot_controller->getValue($this->_robot, 'change_time');
        $this->_perc_price_vs_robot_track = $this->_robot_controller->getValue($this->_robot, 'perc_price_vs_robot_track');
        //$this->_perc_price_vs_robot_track = $this->normalizeFloatValue($this->_perc_price_vs_robot_track);
        $this->_perc_skip_buying_if_price_is_close_to_last_selling = $this->_robot_controller->getValue($this->_robot, 'perc_skip_buying_if_price_is_close_to_last_selling');
        //$this->_perc_skip_buying_if_price_is_close_to_last_selling = $this->normalizeFloatValue($this->_perc_skip_buying_if_price_is_close_to_last_selling);
        // Selling parameters
        $this->_takeprofit = $this->_robot_controller->getValue($this->_robot, 'takeprofit');
        //$this->_takeprofit = $this->normalizeFloatValue($this->_takeprofit);
        $this->_takeprofit_trailing = $this->_robot_controller->getValue($this->_robot, 'takeprofit_trailing');
        //$this->_takeprofit_trailing = $this->normalizeFloatValue($this->_takeprofit_trailing);
        $this->_takeprofit2 = $this->_robot_controller->getValue($this->_robot, 'takeprofit2');
        //$this->_takeprofit2 = $this->normalizeFloatValue($this->_takeprofit2);
        $this->_takeprofit2_trailing = $this->_robot_controller->getValue($this->_robot, 'takeprofit2_trailing');
        //$this->_takeprofit2_trailing = $this->normalizeFloatValue($this->_takeprofit2_trailing);
        $this->_stoploss = $this->_robot_controller->getValue($this->_robot, 'stoploss');
        //$this->_stoploss = $this->normalizeFloatValue($this->_stoploss);
        
        // Init aux vars
        $this->_is_stoploss = false;
        $this->_is_takeprofit = false;
        $this->_profit = 0;
        $this->_asynchronous_transaction = null;
    }
    
    public function getRequirements()
    {
        $buy_is_allowed = $this->enoughSamplesToBuy();
        $sell_is_allowed = $this->enoughSamplesToSell();
        
        return array(
            'buy_is_allowed' => $buy_is_allowed,
            'sell_is_allowed' => $sell_is_allowed,
        );
    }
    
    protected function _enoughSamplesToTrade()
    {
        $samples = $this->getSamples($this->_user, $this->_robot);
        $filter_factor = $this->getRobotValue($this->_user, $this->_robot, 'filter_factor');
        if (count($samples) >= $filter_factor)
        {
            return true;
        }
        
        return false;
    }
    
    public function enoughSamplesToBuy()
    {
        if (!$this->_enoughSamplesToTrade())
        {
            return false;
        }
        
        return true;
    }
    
    public function enoughSamplesToSell()
    {
        if (!$this->_enoughSamplesToTrade())
        {
            return false;
        }
        
        return true;
    }
    
    public function isStoploss()
    {
        return ($this->_is_stoploss);
    }
    
    public function getAsynchronousTransaction()
    {
        return $this->_asynchronous_transaction;
    }
    
    protected function _isTimeToBuy()
    {
        // Set the lowest value
        $lowest_value = $this->getLowestValue($this->_user, $this->_robot);
        if ($this->_robot_track_value < $lowest_value)
        {
            $lowest_value = $this->_robot_track_value;
        }
        $this->setLowestValue($this->_user, $this->_robot, $lowest_value);
        
        // Is enabled to buy?
        if (!$this->_isEnabledToBuy())
        {
            return false;
        }
        
        // Set the real price
        $real_value = $this->getLastPrice($this->_user, $this->_robot);
        
        // Enough real balance to buy?
        if (!$this->_enoughBalanceToBuy($real_value))
        {
            return false;
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
                $filename = '/opt/tmp/try-buying-'.$robot_code.'-'.date('YmdHis');
                file_put_contents($filename, $json_robot);
                break;

            default:
                break;
        }        
        */      
        // Is green candle?
        if (!$this->isGreenCandleOnLastSample($this->_robot))
        {
            return false;
        }
        
        // Is green candle big enough?
        if (!is_null($this->_min_green_candle_size) && $this->_min_green_candle_size > 0)
        {
            $green_candle = $this->getGreenCandleOnLastSample($this->_robot);
            $perc_green_candle = ($green_candle * 100) / $this->_robot_track_value;
            if ($perc_green_candle < $this->_min_green_candle_size)
            {
                return false;
            }
        }
        
        // Take-off
        if (!$this->_isTakeoff($this->_robot_track_value, $lowest_value))
        {
            return false;
        }
        
        // Check take-off with real price
        if (!$this->_isTakeoff($real_value, $lowest_value))
        {
            return false;
        }
        
        // Price > Previous price > Previous price ...
        if (!is_null($this->_number_of_samples_with_price_always_going_up) && $this->_number_of_samples_with_price_always_going_up > 0)
        {
            $all_samples = store::getSamples();
            $total_samples = count($all_samples);
            if ($total_samples < $this->_number_of_samples_with_price_always_going_up)
            {
                return false;
            }
            $higher_price = $real_value;
//            $higher_price = $this->_robot_track_value;
            for ($i=1; $i<$this->_number_of_samples_with_price_always_going_up ; $i++)
            {
                $sample = $all_samples[$total_samples - $i - 1];
                $previous_price = $this->getPrice($sample, $this->_robot['coinpair']);
                if ($higher_price <= $previous_price)
                {
                    return false;
                }
                $higher_price = $previous_price;
            }           
        }
        
        // Check max buying price
        if ($this->_hasExceededMaxBuyingPrice($this->_robot_track_value))
        {
            return false;
        }
        if ($this->_hasExceededMaxBuyingPrice($real_value))
        {
            return false;
        }
        
        // Check changes
        if (!$this->_isChangeWithinLimit())
        {
            return false;
        }
        
        // Check FOMO
        if ($this->_isPriceTooHighVSRobotTrack())
        {
            return false;
        }
        
        // Check if the price is too close to the last selling
        if ($this->_isPriceTooCloseToLastSelling())
        {
            //$this->setLowestValue($this->_user, $this->_robot, null);
            $this->setRSISignalBelow($this->_user, $this->_robot, false);
            return false;
        }
        
        // Check available fund before buying
        if (!$this->_hasEnoughFundToBuy($real_value))
        {
            return false;
        }
        
        // Buy
        return true;
    }

    protected function _isEnabledToBuy()
    {
        if ($this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            return true;
        }
            
        return $this->_robot_controller->isEnabledToBuy($this->_robot);
    }

    protected function _enoughBalanceToBuy($price)
    {
        if ($this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            return true;
        }
        
        $user_code = $this->_user['userdata']['code'];
        $market_coins = store::getMarketCoins($user_code);
        if (empty($market_coins))
        {
            return false;
        }
        
        $market_coin = $this->_robot['market_coin'];
        if (!isset($market_coins[$market_coin]))
        {
            return false;
        }
        
        $mkc = $market_coins[$market_coin];
        $free_balance = $mkc['free_balance'];
        $reserve = (isset($mkc['reserve']) && !empty($mkc['reserve']))? $mkc['reserve'] : 0;
        /*if ($reserve == 0)
        {
            return false;
        }*/
        
        // Sum the amount to min fund
        $last_transaction = $this->getLastTransaction($this->_user, $this->_robot, 'sell');
        $last_prices = $this->getLastPrices($this->_user, $this->_robot);
        $amount = $this->getAmount($this->_robot, 'buy', $last_transaction, $last_prices);
        $amount_market = $amount * $price;
        $reserve += $amount_market;
                
        return ($free_balance >= $reserve);
    }

    protected function _isEnabledToSell()
    {
        if ($this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            return true;
        }
            
        return $this->_robot_controller->isEnabledToSell($this->_robot);
    }
    
    protected function _isChangeWithinLimit()
    {
        if (is_null($this->_change_time))
        {        
            return true;   
        }
        
        $price = $this->_robot_track_value;
        $change_time_value = ($this->_change_time * 60) / $this->_candlestick_interval;
        $last_change_price = store::getRobotValue($this->_user['userdata']['code'], $this->_robot['code'], 'robot_track_value', $change_time_value);
        if (is_null($last_change_price))
        {
            return false;
        }
        //$last_change_price = $this->normalizeFloatValue($last_change_price);
        
        if (!is_numeric($price) || !is_numeric($last_change_price) || $last_change_price == 0)
        {
            return false;
        }
        
        $change = (($price - $last_change_price) / $last_change_price) * 100;
        
        if (!is_null($this->_change_min) && $change < $this->_change_min)
        {   
            return false;
        } 
        
        if (!is_null($this->_change_max) && $change > $this->_change_max)
        {   
            return false;
        }         
            
        return true;      
    }
    
    public function isTimeToDisableBuying($operation)
    {
        // Is enabled to buy?
        if (!$this->_isEnabledToBuy())
        {
            return false;
        }
        
        if ($operation === 'sell' && $this->_robot_controller->isDisableBuyingWhenSell($this->_robot))
        {
            return array(
                'due_to' => 'disable_buying_when_sell'
            );                
        }
        
        if ($operation === 'buy' && $this->_robot_controller->isDisableBuyingWhenBuy($this->_robot))
        {
            return array(
                'due_to' => 'disable_buying_when_buy'
            );                
        }

        if (is_null($this->_change_time) || is_null($this->_change_max_disable_buy))
        {        
            return false;   
        }        
        
        $price = $this->_robot_track_value;
        $change_time_value = ($this->_change_time * 60) / $this->_candlestick_interval;
        $last_change_price = store::getRobotValue($this->_user['userdata']['code'], $this->_robot['code'], 'robot_track_value', $change_time_value);
        //$last_change_price = $this->normalizeFloatValue($last_change_price);
        
        if (!is_numeric($price) || !is_numeric($last_change_price) || $last_change_price == 0)
        {
            return false;
        }
        
        $change = (($price - $last_change_price) / $last_change_price) * 100;
        
        if (strtoupper($change) === 'NAN')
        {
            return false;
        }        
        
        if ($change <= $this->_change_max_disable_buy)
        {   
            return false;
        } 
        
        return array(
            'due_to' => 'change_time',
            'change_time' => $this->_change_time,
            'change' => $change,
            'change_max_disable_buy' => $this->_change_max_disable_buy
        );
    }
    
    protected function _isPriceTooHighVSRobotTrack()
    {
        if (is_null($this->_perc_price_vs_robot_track))
        {        
            return false;   
        }
        
        $real_price_value = $this->getLastPrice($this->_user, $this->_robot);
        $robot_track_value = $this->_robot_track_value;
        
        if (!is_numeric($real_price_value) || !is_numeric($robot_track_value) || $robot_track_value == 0)
        {
            return false;
        }
        
        if ($real_price_value <= $robot_track_value)
        {        
            return false;   
        }
        
        $perc = (($real_price_value - $robot_track_value) / $robot_track_value) * 100;
        if ($perc > $this->_perc_price_vs_robot_track)
        {
            return true;
        }
        
        return false;
    }
    
    protected function _isPriceTooCloseToLastSelling()
    {
        if (is_null($this->_perc_skip_buying_if_price_is_close_to_last_selling))
        {        
            return false;   
        }
        
        // Get the last selling price
        $selling_price = $this->getSellingPrice($this->_user, $this->_robot);
        if (is_null($selling_price))
        {        
            return false;   
        }
        
        //$current_price = $this->getLastPrice($this->_user, $this->_robot);
        $current_price = $this->_robot_track_value;
        
        if (!is_numeric($current_price) || !is_numeric($selling_price) || $selling_price == 0)
        {
            return false;
        }
        
        $real_perc = abs((($current_price - $selling_price) / $selling_price) * 100);
        
        if ($real_perc <= $this->_perc_skip_buying_if_price_is_close_to_last_selling)
        {        
            return true;   
        }
        
        return false;
    }
    
    protected function _isTakeoff($value, $lowest_value)
    {
        
        if (!is_numeric($value) || !is_numeric($lowest_value) || !is_numeric($this->_takeoff))
        {
            return false;
        }
        
        if ($value > $lowest_value)
        {
            $takeoff_price = ( ($lowest_value * $this->_takeoff) / 100 ) + $lowest_value;
            return ($value > $takeoff_price);
        }
        
        return false;
    }

    protected function _hasEnoughFundToBuy($price)
    {
        if (!isset($this->_robot['fund']) || 
            !$this->_robot_controller->isAsynchronous($this->_robot) || 
            $this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            return true;
        }
        
        $fund = $this->_robot['fund'];
        $pending_total_amount = 0;
        
        /*
        $robots = $this->_user['robots'];
        $group = $this->_robot['group'];        
        $pending_asynchronous_transactions = store::getPendingAsynchronousTransactions($this->_user_code, null);
        foreach ($pending_asynchronous_transactions as $user_code => $transactions_by_code)
        {
            foreach ($transactions_by_code as $transaction)
            {
                $robot_code = $transaction['robot_code'];
                if (!isset($robots[$robot_code]) || 
                    $robots[$robot_code]['group'] !== $group)
                {
                    continue;
                }
                $amount_market_price = $transaction['amount'] * $price;
                $pending_total_amount += $amount_market_price;
            }
        }        
        */
        
        $pending_asynchronous_transactions = store::getPendingAsynchronousTransactions($this->_user_code, $this->_robot_code);
        foreach ($pending_asynchronous_transactions as $transaction)
        {
            $amount_market_price = $transaction['amount'] * $price;
            $pending_total_amount += $amount_market_price;            
        }
            
        return ($pending_total_amount < $fund);
    }

    protected function _hasExceededMaxBuyingPrice($value)
    {
        if (!isset($this->_robot['max_buying_price']) || $this->_robot_controller->isTrainingInModeWild($this->_robot))
        {
            return false;
        }
        
        $max_buying_price = $this->_robot['max_buying_price'];
        
        return ($value > $max_buying_price);
    }
    
    protected function _isTimeToSell()
    {    
        
        // Is enabled to sell?
        if (!$this->_isEnabledToSell($this->_robot))
        {
            return false;
        }
        
        if ($this->_stoploss == 0)
        {
            // It's use for other strategies (macd, etc..)
            return true;
        }
        
        // Get buying price
        $buying_prices = $this->getBuyingPrices($this->_user, $this->_robot);
        $buying_price = $buying_prices['price'];
        $buying_price_of_robot_track = $buying_prices['robot_track_value'];
        
        /*
         * 
         * Stop-loss
         * 
         */
        
        // Stop-loss?
        $stoploss_buying_price = ($buying_price > $buying_price_of_robot_track)? $buying_price_of_robot_track : $buying_price;
        if ($this->_isStoploss($this->_robot_track_value, $stoploss_buying_price))
        {
            // Check stop-loss with real price
            $real_value = $this->getLastPrice($this->_user, $this->_robot);
            if ($this->_isStoploss($real_value, $stoploss_buying_price))
            {
                // Sell by stop-loss
                $this->_is_stoploss = true;
                return true;
            }            
        }
        
        /*
         * 
         * Take-profit
         * 
         */
        
        if ($this->_takeprofit == 0)
        {
            // It's use for other strategies (macd, etc..)
            return true;
        }
        
        if ($this->_robot_track_value < $buying_price)
        {
            return false;
        }
        
        // Set the highest value
        $highest_value = $this->getHighestValue($this->_user, $this->_robot);
        if ($this->_robot_track_value > $highest_value)
        {
            $highest_value = $this->_robot_track_value;
        }
        $this->setHighestValue($this->_user, $this->_robot, $highest_value);
        
        // Take-profit?
        if (!$this->_isTakeprofit($this->_robot_track_value, $buying_price, $highest_value))
        {
            return false;
        }
        
        // Check take-profit with real price
        $real_value = $this->getLastPrice($this->_user, $this->_robot);
        if (!$this->_isTakeprofit($real_value, $buying_price, $highest_value, false))
        {
            return false;
        }
        
        $this->_is_takeprofit = true;
        $this->_profit = $real_value - $buying_price;
        
        // Sell
        return true;
    }
    
    protected function _isStoploss($value, $buying_price)
    {
        if ($value < $buying_price)
        {
            $stoploss_price = ( ($buying_price * $this->_stoploss * (-1)) / 100 ) + $buying_price;
            return ($value < $stoploss_price);
        }
        
        return false;
    }
    
    protected function _isTakeprofit2Enabled()
    {
        return (
            isset($this->_takeprofit2) && 
            isset($this->_takeprofit2_trailing) &&
            $this->_takeprofit2 > 0 && 
            $this->_takeprofit2_trailing > 0
        );
    }
    
    protected function _isTakeprofit($value, $buying_price, $highest_value, $is_robot_track = true)
    {
        
        /*
         * Take profit 2
         */        
        if ($this->_isTakeprofit2Enabled())
        {
            $takeprofit2_price = ( ($buying_price * $this->_takeprofit2) / 100 ) + $buying_price;
            $takeprofit2_trailing_price = ( ($highest_value * $this->_takeprofit2_trailing * (-1)) / 100 ) + $highest_value;
            
            if ($value > $takeprofit2_price)
            {
                if ($takeprofit2_trailing_price < $takeprofit2_price)
                {
                    // Take-profit threshold is not activated yet
                    return false;
                }
                if ($value > $takeprofit2_trailing_price)
                {
                    return false;
                }                
            }
        }
        
        /*
         * Take profit 1
         */
        $takeprofit_price = ( ($buying_price * $this->_takeprofit) / 100 ) + $buying_price;
        $takeprofit_trailing_price = ( ($highest_value * $this->_takeprofit_trailing * (-1)) / 100 ) + $highest_value;        
        
        if ($value < $takeprofit_price)
        {
            // The price is greater than buying price but less than takeprofit
            if ($is_robot_track)
            {
                // Reset highest value
                $this->setHighestValue($this->_user, $this->_robot, null);                
            }
            return false;
        }
        
        if ($takeprofit_trailing_price < $takeprofit_price)
        {
            // Take-profit threshold is not activated yet
            return false;
        }
        
        if ($value > $takeprofit_trailing_price)
        {
            return false;
        }
        
        return true;
    }
    
}
