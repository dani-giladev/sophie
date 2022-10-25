<?php

namespace modules\cryptos\robot\trading\strategies;

// Controllers
use modules\cryptos\robot\trading\strategies\scalping;
use modules\cryptos\robot\store;

/**
 *
 * @author Dani Gilabert
 * 
 */

class basicMode extends scalping
{
    // Indicators
    // Moving Averages

    // MACD
    protected $_macd_min_lowest_value;
    protected $_macd_max_lowest_value;
    
    // RSI
    protected $_rsi_oversold;
    protected $_rsi_overbought;
    
    // OBV
    
    // Volume
    protected $_perc_volume_vs_average;
    
    public function setCurrentValues($user, $robot)
    {
        $this->_setCurrentValues($user, $robot);
        
        // Indicators
        // Moving Averages

        // MACD
        $this->_macd_min_lowest_value = $this->_robot_controller->getValue($this->_robot, 'macd_min_lowest_value');
        //$this->_macd_min_lowest_value = $this->normalizeFloatValue($this->_macd_min_lowest_value);
        $this->_macd_max_lowest_value = $this->_robot_controller->getValue($this->_robot, 'macd_max_lowest_value');
        //$this->_macd_max_lowest_value = $this->normalizeFloatValue($this->_macd_max_lowest_value);

        // RSI
        $this->_rsi_oversold = $this->_robot_controller->getValue($this->_robot, 'rsi_oversold');
        $this->_rsi_overbought = $this->_robot_controller->getValue($this->_robot, 'rsi_overbought');
        
        // OBV
        
        // Volume
        $this->_perc_volume_vs_average = $this->_robot_controller->getValue($this->_robot, 'perc_volume_vs_average');
        //$this->_perc_volume_vs_average = $this->normalizeFloatValue($this->_perc_volume_vs_average);
    }
    
    public function enoughSamplesToBuy()
    {
        if (!$this->_enoughSamplesToTrade())
        {
            return false;
        }
        
        $samples = store::getSamples(); 
        
        // Get max filter factor value
        $max_filter_factor = $this->_robot_controller->getMaxFilterFactor($this->_robot);
        
        if (count($samples) >= ($max_filter_factor / $this->_candlestick_interval))
        {
            return true;
        }
        
        return false;
    }
    
    public function enoughSamplesToSell()
    {
        if (!$this->_enoughSamplesToTrade())
        {
            return false;
        }
        
        return true;
    }
    
    public function isTimeToBuy()
    {
        $last_operation = $this->_robot_controller->getLastOperation($this->_robot);
        if ($last_operation === 'buy')
        {
            return false;
        }
        
        // Scalping
        $is_time_to_buy_on_scalping = $this->_isTimeToBuy();
        
        // Moving Averages
        $is_time_to_buy_on_ma = $this->_isTimeToBuyOnMovingAverages();
        
        // MACD
        $is_time_to_buy_on_macd = $this->_isTimeToBuyOnMACD();
        
        // RSI
        $is_time_to_buy_on_rsi = $this->_isTimeToBuyOnRSI();
        
        // OBV
        $is_time_to_buy_on_obv = $this->_isTimeToBuyOnOBV();
        
        // Volume
        $is_time_to_buy_on_volume = $this->_isTimeToBuyOnVolume();
        
        if (!$is_time_to_buy_on_scalping || 
            !$is_time_to_buy_on_ma || 
            !$is_time_to_buy_on_obv || 
            !$is_time_to_buy_on_volume
        )
        {
            return false;
        }        
        
        // Check FOMO
        if ($this->_isTimeToBuyOnFOMO())
        {
            return true;
        }
        
        if (!$is_time_to_buy_on_macd || 
            !$is_time_to_buy_on_rsi
        )
        {
            return false;
        }
        
        // Buy
        return true;
    }
    
    protected function _isTimeToSellAsynchronously()
    { 
        if (!$this->_robot_controller->isAsynchronous($this->_robot))
        {
            return false;
        }
        
        // Check all async. buying and not completed
        $pending_asynchronous_transactions = store::getPendingAsynchronousTransactions($this->_user_code, $this->_robot_code);
        foreach ($pending_asynchronous_transactions as $transaction)
        {
            $buying_price = $transaction['price'];
            //$buying_price_of_robot_track = $transaction['robot_track_value'];    
            $real_value = $this->getLastPrice($this->_user, $this->_robot);
            
            if (isset($transaction['selling_order_activated']) && $transaction['selling_order_activated'])
            {
            
            }
            else
            {
                // Take-profit?
                $takeprofit_price = ( ($buying_price * $this->_takeprofit) / 100 ) + $buying_price;
                /*if ($this->_robot_track_value < $takeprofit_price)
                {
                    continue;
                }*/
                // Check take-profit with real price
                if ($real_value < $takeprofit_price)
                {
                    continue;
                }                   
            }

            $this->_asynchronous_transaction = $transaction;
            $this->_is_takeprofit = true;
            $this->_profit = $real_value - $buying_price;
            
            // Sell
            return true;        
        }
            
        return false;
    }
    
    public function isTimeToSell()
    { 
        if ($this->_isTimeToSellAsynchronously())
        {
            // Sell
            return true;
        }
        
        $last_operation = $this->_robot_controller->getLastOperation($this->_robot);
        if ($last_operation !== 'buy')
        {
            return false;
        }
        
        $is_time_to_sell_on_scalping = $this->_isTimeToSell();
        
        // MACD
        $is_time_to_sell_on_macd = $this->_isTimeToSellOnMACD();
        
        if (!$is_time_to_sell_on_scalping)
        {
            return false;
        }  
        
        if ($this->_is_stoploss || ($is_time_to_sell_on_macd && $this->_robot_controller->isIndicatorEnabledToSell($this->_robot, 'macd')))
        {
            // Sell
            return true;                
        }

        if ($this->_is_takeprofit)
        {
            return true;
        }
        
        return false;
    }
    
    protected function _isTimeToBuyOnMovingAverages()
    {
        if (!$this->_robot_controller->isIndicatorEnabledToBuy($this->_robot, 'ma'))
        {
            return true;
        }
        
        $ma_fast_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'ma_fast')['filter_value'];
        $ma_slow_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'ma_slow')['filter_value'];
        
        if ($ma_fast_filter_value > $ma_slow_filter_value)
        {
            $this->setFilterPosition($this->_user, $this->_robot, 'ma', 'above', true);
        }
        elseif ($ma_fast_filter_value < $ma_slow_filter_value)
        {
            $this->setFilterPosition($this->_user, $this->_robot, 'ma', 'below', true);
        }          
        
        if (!$this->isFilterCrossed($this->_user, $this->_robot, 'ma'))
        {
            return false;
        }
        
        if ($ma_fast_filter_value < $ma_slow_filter_value)
        {
            return false;
        }
        
        return true;
    }
    
    protected function _isTimeToBuyOnMACD()
    {
        if (!$this->_robot_controller->isIndicatorEnabledToBuy($this->_robot, 'macd'))
        {
            return true;
        }
        
        $macd_value = $this->getRobotValue($this->_user, $this->_robot, 'macd');
        $macd_signal_value = $this->getFilterValues($this->_user, $this->_robot, 'macd_signal')['filter_value'];
        
        // Set lowest value
        $macd_lowest_value = $this->getRobotValue($this->_user, $this->_robot, 'macd_lowest_value');
        if (!isset($macd_lowest_value) || $macd_value < $macd_lowest_value)
        {
            $macd_lowest_value = $macd_value;
        }
        if ($macd_value >= 0 && $macd_value < $macd_signal_value)
        {
            // Reset lowest value
            $macd_lowest_value = 0;
        }
        $this->setRobotValue($this->_user, $this->_robot, 'macd_lowest_value', $macd_lowest_value);
        
        // Set divergence
        $macd_divergence_status = $this->getRobotValue($this->_user, $this->_robot, 'macd_divergence_status');
        if (!isset($macd_lowest_value) || $macd_value >= 0)
        {
            $macd_divergence_status = 0;
        }
        if ($macd_divergence_status == 0 && $macd_value < 0 && $macd_value < $macd_signal_value)
        {
            $macd_divergence_status = 1;
        }
        if ($macd_divergence_status == 1 && $macd_value > $macd_signal_value)
        {
            $macd_divergence_status = 2;
        }
        if ($macd_divergence_status == 2 && $macd_value < $macd_signal_value)
        {
            $macd_divergence_status = 3;
        }
        if ($macd_divergence_status == 3 && $macd_value > $macd_signal_value)
        {
            $macd_divergence_status = 4; // Divergence!!!
        }
        $this->setRobotValue($this->_user, $this->_robot, 'macd_divergence_status', $macd_divergence_status);
        
        if ($macd_value < $macd_signal_value || $macd_value > 0)
        {
            return false;
        }
        
        // Check max/min lowest values
        if (!is_null($this->_macd_max_lowest_value) && $macd_lowest_value < $this->_macd_max_lowest_value)
        {
            return false;
        }
        if (!is_null($this->_macd_min_lowest_value) && $macd_lowest_value > $this->_macd_min_lowest_value)
        {
            return false;
        }
        
        return true;
    }
    
    protected function _isTimeToSellOnMACD()
    {
        if (!$this->_robot_controller->isIndicatorEnabledToSell($this->_robot, 'macd'))
        {
            return true;
        }
        
        $macd_value = $this->getRobotValue($this->_user, $this->_robot, 'macd');
        $macd_signal_value = $this->getFilterValues($this->_user, $this->_robot, 'macd_signal')['filter_value'];
        
        if ($macd_value > $macd_signal_value || $macd_value <= 0)
        {
            return false;
        }
        
        return true;
    }
    
    protected function _isTimeToBuyOnRSI()
    {
        if (!$this->_robot_controller->isIndicatorEnabledToBuy($this->_robot, 'rsi'))
        {
            return true;
        }
        
        //$rsi_value = $this->getRobotValue($this->_user, $this->_robot, 'rsi');
        $rsi_signal_value = $this->getFilterValues($this->_user, $this->_robot, 'rsi_signal')['filter_value'];
        
        if ($rsi_signal_value < $this->_rsi_oversold)
        {
            // Set flag
            $this->setRSISignalBelow($this->_user, $this->_robot, true);
            return true;
        }
        
        if ($rsi_signal_value > $this->_rsi_overbought)
        {
            // Reset flag
            $this->setRSISignalBelow($this->_user, $this->_robot, false);
            return false;
        }
        
        if (!$this->hasRSISignalBeenBelow($this->_user, $this->_robot))
        {
            return false;
        }
        
        return true;
    }
    
    protected function _isTimeToBuyOnOBV()
    {
        if (!$this->_robot_controller->isIndicatorEnabledToBuy($this->_robot, 'obv'))
        {
            return true;
        }
        
        //$obv_value = $this->getRobotValue($this->_user, $this->_robot, 'obv');
        $obv_fast_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'obv_fast')['filter_value'];
        $obv_slow_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'obv_slow')['filter_value'];
                
        if ($obv_fast_filter_value < $obv_slow_filter_value)
        {
            return false;
        }
        
        return true;
    }
    
    protected function _isTimeToBuyOnVolume()
    {
        if (!$this->_robot_controller->isIndicatorEnabledToBuy($this->_robot, 'volume'))
        {
            return true;
        }
        
        $volume = $this->getVolumeOfLastSample($this->_robot);
        $volume_fast_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'volume_fast')['filter_value'];
        $volume_slow_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'volume_slow')['filter_value'];
        
        if ($volume <= $volume_fast_filter_value || $volume_fast_filter_value <= $volume_slow_filter_value)
        {
            return false;
        }
        
        return true;
    }
    
    protected function _isTimeToBuyOnFOMO()
    {
        if (!$this->_robot_controller->isIndicatorEnabledToBuy($this->_robot, 'volume'))
        {
            return false;
        }
        
        $volume = $this->getVolumeOfLastSample($this->_robot);
        $volume_fast_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'volume_fast')['filter_value'];
        //$volume_slow_filter_value = $this->getFilterValues($this->_user, $this->_robot, 'volume_slow')['filter_value'];
        
        if (is_null($this->_perc_volume_vs_average) || $this->_perc_volume_vs_average == 0)
        {
            return false;
        }
        
        $x = ($volume_fast_filter_value * $this->_perc_volume_vs_average) / 100;
        if ($volume <= ($x + $volume_fast_filter_value))
        {
            return false;
        }        
        
        return true;
    }
    
}
