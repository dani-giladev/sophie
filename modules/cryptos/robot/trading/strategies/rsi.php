<?php

namespace modules\cryptos\robot\trading\strategies;

// Controllers
use modules\cryptos\robot\trading\strategies\basicMode;

/**
 *
 * @author Dani Gilabert
 * 
 */

class rsi extends basicMode
{
    
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
        
        // RSI
        $is_time_to_buy_on_rsi = $this->_isTimeToBuyOnRSI();
        
        if (!$is_time_to_buy_on_scalping || 
            !$is_time_to_buy_on_ma || 
            !$is_time_to_buy_on_rsi
        )
        {
            return false;
        } 
        
        // Buy
        return true;
    }

    
}
