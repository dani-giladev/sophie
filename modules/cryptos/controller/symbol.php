<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;
use modules\cryptos\controller\binance;

/**
 * symbol controller
 *
 * @author Dani Gilabert
 */
class symbol extends controller
{
    public function getAll()
    {
        $view = $this->model->getView("symbol");
        $data = $view->exec()['data'];
        
        if (empty($data))
        {
            $symbols = $this->getSymbols()['data'];
            foreach ($symbols as $symbol) {
                $this->save(array(
                    'code' => $symbol['code'],
                    'name' => $symbol['name'],
                    'available' => true
                ));
            }
            $view = $this->model->getView("symbol");
            $data = $view->exec()['data'];
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getFiltered($params)
    {
        $available = isset($params['available']) ? ($params['available'] == 'true' || $params['available'] == 'on') : null;
        
        $raw_data = $this->getAll()['data'];
        if (empty($raw_data))
        {
            return helpers::resStruct(true);
        }
        
        $data = array();
        foreach($raw_data as $symbol)
        {
            if (isset($available) && $available != $symbol['available'])
            {
                continue;
            }

            // Clean item
            $this->model->clean($symbol);

            // Add item
            $data[] = $symbol; 
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function save($params)
    {
        // Main
        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $code = (isset($params['code']))? $params['code'] : $code = date("YmdHjs").$micro;
        $name = (isset($params['name']))? $params['name'] : "";
        // Properties
        $available = (isset($params['available']) && ($params['available'] == 'on' || $params['available'] == 'true'));
        $decimals = (isset($params['decimals']) && trim($params['decimals']) !== "")? $params['decimals'] : "0";
        $price_decimals = (isset($params['price_decimals']) && trim($params['price_decimals']) !== "")? $params['price_decimals'] : "0";
        $min_notional = (isset($params['min_notional']) && trim($params['min_notional']) !== "")? $params['min_notional'] : "0";
        $status = (isset($params['status']))? $params['status'] : null;
        $notes = (isset($params['notes']))? $params['notes'] : "";
        // Users
        $user_code = (isset($params['user_code']))? $params['user_code'] : $this->token->getUserCode();
        $user_name = (isset($params['user_name']))? $params['user_name'] : $this->token->getUserName();

        if ((isset($params['id']) && !empty($params['id'])))
        {
            // Edit
            $is_new = false;
            $id = strtolower($params['id']);
            $doc = $this->model->get($id)['data'];
        }
        else
        {
            // New
            $is_new = true;
            $id = strtolower('cryptos_symbol-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->symbol['the_symbol_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            
            $doc = array();
            $doc['code'] = $code;
            // Creation
            $doc['created_by_user'] = $user_code;
            $doc['created_by_user_name'] = $user_name;
            $doc['creation_date'] = date("Y-m-d H:i"); 
        }
        
        // Main
        $doc['name'] = $name;
        
        // Properties
        $doc['available'] = $available;
        $doc['decimals'] = $decimals;
        $doc['price_decimals'] = $price_decimals;
        $doc['min_notional'] = $min_notional;
        if (!is_null($status))
        {
            $doc['status'] = $status;
        }
        $doc['notes'] = $notes;
        
        // Last modification
        $doc['modified_by_user'] = $user_code;
        $doc['modified_by_user_name'] = $user_name;
        $doc['last_modification_date'] = date("Y-m-d H:i");
        
        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }

    public function getSymbols()
    {
        $ret = array();
        $user_code = (!empty($this->token->getUserCode())) ? $this->token->getUserCode() : 'admin';
        
        $binance_controller = new binance();       
        $api = $binance_controller->getApi($user_code);
        if ($api === false)
        {
            return helpers::resStruct(false);
        }
        
        $ticker = $api->prices();

        foreach($ticker as $coinpair => $value)
        {
            $ret[] = array(
                "code" => $coinpair,
                "name" => $this->getCoinpairName($coinpair)
            );
        }

        return helpers::resStruct(true, "", $ret);
    }

    public function getCoins()
    {
        $ret = array();
        
        $symbols = $this->getAll()['data'];
        if (empty($symbols))
        {
            return helpers::resStruct(true);
        }
        
        foreach($symbols as $values)
        {
            $coinpair = $values['code'];
            $coin = $this->getCoin($coinpair);
            
            $ret[] = array(
                "code" => $coin,
                "name" => $coin
            );
        }
        
        $ret[] = array(
            "code" => "USDT",
            "name" => "USDT"
        );        

        return helpers::resStruct(true, "", $ret);
    }
    
    public function getCoin($coinpair)
    {
        $market_coin = $this->getMarketCoin($coinpair);
        $coin = str_replace($market_coin, "", $coinpair);
        return $coin;
    }
    
    public function getMarketCoin($coinpair)
    {
        $market_coin = substr($coinpair, strlen($coinpair) - 3, strlen($coinpair));
        switch ($market_coin) {
            case "SDT":
                $market_coin = "USDT";
                break;
            case "USD":
                $market_coin = "TUSD";
                break;
            case "SDC":
                $market_coin = "USDC";
                break;
            case "SDS":
                $market_coin = "USDS";
                break;
            default:
                break;
        }
        return $market_coin;
    }
    
    public function getCoinpairName($coinpair)
    {
        return $this->getCoin($coinpair)."/".$this->getMarketCoin($coinpair);
    }
    
    public function getRequiredSymbols()
    {
        // Required pairs in order to calculate commissions
        return array("BTCUSDT", 
                     "BNBBTC", "BNBETH", "BNBUSDT", 
                     "ETHBTC", "ETHUSDT", 
                     "XRPBTC", "XRPBNB", "XRPUSDT");
    }
}
