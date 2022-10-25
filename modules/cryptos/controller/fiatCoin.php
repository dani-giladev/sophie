<?php

namespace modules\cryptos\controller;

use base\core\controller\helpers;

/**
 * fiatCoin controller
 *
 * @author Dani Gilabert
 */
class fiatCoin
{
    private $_fiat_coins = array(
        "USDT" => array(
            "code" => "USDT",
            "name" => "Tether"
        ),
        "USDC" => array(
            "code" => "USDC",
            "name" => "USD Coin"
        )
    );
    
    public function getAll()
    {
        $data = array();
        
        foreach ($this->_fiat_coins as $code => $values)
        {
            $data[] = array(
                "code" => $values['code'],
                "name" => $values['name']
            );
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function isFiat($coin)
    {
        return (isset($this->_fiat_coins[$coin]));
    }
    
}
