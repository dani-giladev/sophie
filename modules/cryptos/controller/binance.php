<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\config;

/**
 * Binance controller
 *
 * @author Dani Gilabert
 */
class binance
{
    protected $_config; 
    protected $_keys_path;
    
    public function __construct()
    {
        $this->_config = new config('cryptos');
        //$this->_keys_path = __DIR__."/../res/keys_store/";
        $this->_keys_path = $this->_config->getDBPARAM("KEYS_STORE_PATH");
    }
    
    public function getApi($user_code)
    {
        //$key_filename = realpath($this->_keys_path."/key-binance-api_$user_code.json");
        $key_filename = $this->_keys_path."/key-binance-api_$user_code.json";
        if (!file_exists($key_filename))
        {
            return false;
        }   

        //$api = new \Binance\API($key_filename);
        $key_array = json_decode(file_get_contents($key_filename), true);
        $key = $key_array['api-key'];
        $secret = $key_array['api-secret'];
        
        return new \Binance\API($key, $secret);  
    }    

    public function getLastPrices($api)
    {
        $ticker = $api->prices();
        return $ticker;
    }   

    public function getLastPrice($api, $symbol)
    {
        $ticker = $this->getLastPrices($api);
        return $ticker[$symbol];
    }

    public function buy($api, $symbol, $amount, $price = 0, $type = "MARKET")
    {
        return $api->buy($symbol, $amount, $price, $type);             
    }

    public function sell($api, $symbol, $amount, $price = 0, $type = "MARKET", $flags = [])
    {
        return $api->sell($symbol, $amount, $price, $type, $flags);             
    }
  
}
