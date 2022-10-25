<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use base\core\controller\token;
use modules\cryptos\controller\binance;
use modules\cryptos\controller\reportProfit;
use modules\cryptos\controller\floating;
use modules\cryptos\controller\sample;
use modules\cryptos\controller\sample00h;
use modules\cryptos\controller\symbol;
use modules\cryptos\controller\marketCoin;

/**
 * Cryptos dashboard controller
 *
 * @author Dani Gilabert
 */
class dashboard
{
    public $token;
    
    public function getDashboard($params)
    {
        $this->token = new token();
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $floating_showfree = (!isset($params['floating_showfree']) || empty($params['floating_showfree'])) ? true : ($params['floating_showfree'] == 'true');
        $change_time_chart_btc = (!isset($params['change_time_chart_btc']) || empty($params['change_time_chart_btc'])) ? false : ($params['change_time_chart_btc'] == 'true');
        $change_time_chart_alts = (!isset($params['change_time_chart_alts']) || empty($params['change_time_chart_alts'])) ? true : ($params['change_time_chart_alts'] == 'true');
        
        $binance_data = $this->_getBinanceData($user_code);
        if (!$binance_data['success'])
        {
            return helpers::resStruct(false, $binance_data['msg']);
        }
        $account = $binance_data['data']['account'];
        $prices = $binance_data['data']['prices'];
        
        /*
         * TODAY'S PROFITS
         */        
        $daily_profits_values = $this->_getDailyProfitsValues($user_code, $prices);
        $sum_profit_usdt = $daily_profits_values['sum_profit_usdt'];
        $sum_total_commission_usdt = $daily_profits_values['sum_total_commission_usdt'];
        $sum_total_profit_usdt = $daily_profits_values['sum_total_profit_usdt'];
        //$sum_total_profit_perc = $daily_profits_values['sum_total_profit_perc'];
        //$counter_total_profit_perc = $daily_profits_values['counter_total_profit_perc'];
        $sum_total_profit_usdt_now = $daily_profits_values['sum_total_profit_usdt_now'];
        $sum_total_market_profit_btc = $daily_profits_values['sum_total_market_profit_btc'];
        $sum_total_market_profit_eth = $daily_profits_values['sum_total_market_profit_eth'];
        $sum_total_market_profit_bnb = $daily_profits_values['sum_total_market_profit_bnb'];
        $sum_total_market_profit_xrp = $daily_profits_values['sum_total_market_profit_xrp'];
        $sum_total_market_profit_usdt = $daily_profits_values['sum_total_market_profit_usdt'];
        $sum_buyings = $daily_profits_values['sum_buyings'];
        $sum_trades = $daily_profits_values['sum_trades'];
        $av_total_profit_perc = $daily_profits_values['av_total_profit_perc'];
        
        /*
         * REAL BALANCE
         */  
        $real_balance_values = $this->_getRealBalanceValues($account, $prices);
        $real_balance_total_btc = $real_balance_values['real_balance_total_btc'];
        $real_balance_total_usdt = $real_balance_values['real_balance_total_usdt'];
        $real_balance_chart = $real_balance_values['real_balance_chart'];
        $total_coins = $real_balance_values['real_balance_numer_of_coins'];
        $real_btcs_by_coin = $real_balance_values['real_btcs_by_coin'];
                
        /*
         * FLOATING
         */  
        $floating_values = $this->_getFloatingValues($user_code, $prices, $real_btcs_by_coin, $floating_showfree);
        $floating_total_btc = $floating_values['floating_total_btc'];
        $floating_total_usdt = $floating_values['floating_total_usdt'];
        $floating_chart = $floating_values['floating_chart'];
                
        /*
         * CHANGE TIME VALUES
         */ 
        $change_time_values = $this->_getChangeTimeValues($change_time_chart_btc, $change_time_chart_alts);
        $change_time_now = $change_time_values['change_time_now'];
        $change_time_chart = $change_time_values['change_time_chart'];
        $change_time_by_marketcoin_chart = $change_time_values['change_time_by_marketcoin_chart'];
        
        // Happy end
        $data = array(
            
            /*
             * TODAY'S PROFITS
             */
            'sum_profit_usdt' => $sum_profit_usdt,
            'sum_total_commission_usdt' => $sum_total_commission_usdt,
            'sum_total_profit_usdt' => $sum_total_profit_usdt,
            'sum_total_profit_perc' => $av_total_profit_perc,
            'sum_total_profit_usdt_now' => $sum_total_profit_usdt_now,
            'sum_total_market_profit_btc' => $sum_total_market_profit_btc,
            'sum_total_market_profit_eth' => $sum_total_market_profit_eth,
            'sum_total_market_profit_bnb' => $sum_total_market_profit_bnb,
            'sum_total_market_profit_xrp' => $sum_total_market_profit_xrp,
            'sum_total_market_profit_usdt' => $sum_total_market_profit_usdt,
            'sum_buyings' => $sum_buyings,
            'sum_trades' => $sum_trades,
                
            /*
             * REAL BALANCE
             */   
            'real_balance_total_btc' => number_format($real_balance_total_btc, 8, ".", ","),
            'real_balance_total_usdt' => number_format($real_balance_total_usdt, 2, ".", ","),
            'real_balance_chart' => $real_balance_chart,
            'real_balance_numer_of_coins' => $total_coins,
                
            /*
             * FLOATING
             */ 
            'floating_total_btc' => number_format($floating_total_btc, 8, ".", ","),
            'floating_total_usdt' => number_format($floating_total_usdt, 2, ".", ","),
            'floating_chart' => $floating_chart,
            'floating_showfree' => $floating_showfree,
                
            /*
             * CHANGE TIME VALUES
             */  
            'change_time_now' => $change_time_now,
            'change_time_chart' => $change_time_chart,
            'change_time_chart_btc' => $change_time_chart_btc,
            'change_time_chart_alts' => $change_time_chart_alts,
            'change_time_by_marketcoin_chart' => $change_time_by_marketcoin_chart
        );
        
        return helpers::resStruct(true, "", $data);
    }
    
    private function _getBinanceData($user_code)
    {
        ob_start();
        
        $binance_controller = new binance();       
        $api = $binance_controller->getApi($user_code);
        
        if ($api === false)
        {
            ob_end_clean();
            $msg = "The user '$user_code' does not have assigned API. Please, config it.";
            return helpers::resStruct(false, $msg);
        }
        
        // Get user account info
        $account = $api->account();
            
        ob_end_clean();
        
        if (!isset($account['balances']))
        {
            $msg = "Error: ".$account['code']." - ".$account['msg'];
            return helpers::resStruct(false, $msg);
        }
        
        $prices = $api->prices();

        return helpers::resStruct(true, '', array(
            'account' => $account,
            'prices' => $prices
        ));
    }
    
    public function getFloatingData($params)
    {
        $this->token = new token();
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $floating_showfree = (!isset($params['floating_showfree']) || empty($params['floating_showfree'])) ? false : ($params['floating_showfree'] == 'true');
        
        $binance_data = $this->_getBinanceData($user_code);
        if (!$binance_data['success'])
        {
            return helpers::resStruct(false, $binance_data['msg']);
        }
        $account = $binance_data['data']['account'];
        $prices = $binance_data['data']['prices'];     
        
        $real_balance_values = $this->_getRealBalanceValues($account, $prices);
        $real_btcs_by_coin = $real_balance_values['real_btcs_by_coin'];
        
        $floating_values = $this->_getFloatingValues($user_code, $prices, $real_btcs_by_coin, $floating_showfree);
        $floating_total_btc = $floating_values['floating_total_btc'];
        $floating_total_usdt = $floating_values['floating_total_usdt'];
        $floating_chart = $floating_values['floating_chart'];
        
        $data = array(
            'floating_total_btc' => number_format($floating_total_btc, 8, ".", ","),
            'floating_total_usdt' => number_format($floating_total_usdt, 2, ".", ","),
            'floating_chart' => $floating_chart,
            'floating_showfree' => $floating_showfree
        );
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getChangeTimeData($params)
    {
        $change_time_chart_btc = (!isset($params['change_time_chart_btc']) || empty($params['change_time_chart_btc'])) ? false : ($params['change_time_chart_btc'] == 'true');
        $change_time_chart_alts = (!isset($params['change_time_chart_alts']) || empty($params['change_time_chart_alts'])) ? true : ($params['change_time_chart_alts'] == 'true');
        
        $change_time_values = $this->_getChangeTimeValues($change_time_chart_btc, $change_time_chart_alts);
        $change_time_now = $change_time_values['change_time_now'];
        $change_time_chart = $change_time_values['change_time_chart'];
        $change_time_by_marketcoin_chart = $change_time_values['change_time_by_marketcoin_chart'];
        
        $data = array(
            'change_time_now' => $change_time_now,
            'change_time_chart' => $change_time_chart,
            'change_time_chart_btc' => $change_time_chart_btc,
            'change_time_chart_alts' => $change_time_chart_alts,
            'change_time_by_marketcoin_chart' => $change_time_by_marketcoin_chart
        );
        
        return helpers::resStruct(true, "", $data);
    }
    
    private function _getBTCValue($amount, $coin, $prices)
    {
        if ($coin === 'BTC')
        {
            $amount_btc = $amount;
        }
        else
        {
            if (!isset($prices[$coin."BTC"]) || 
                $coin === "USDC" // USDCBTC has a wrong price!!??
            )
            {
                if (!isset($prices["BTC".$coin]))
                {
                    return null;
                }
                $_1btc = $prices["BTC".$coin];
                $amount_btc = $amount / $_1btc;
            }
            else
            {
                $amount_btc = $amount * $prices[$coin."BTC"]; 
            }               
        }
        
        return $amount_btc;
    }
    
    public function getDailyProfitsValues($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $prices = isset($params['prices']) ? $params['prices'] : null;
        $date = isset($params['date']) ? $params['date'] : null;
        
        if (is_null($prices))
        {
            $binance_controller = new binance();       
            $api = $binance_controller->getApi($user_code);
            if ($api === false)
            {
                $msg = "The user '$user_code' does not have assigned API. Please, config it.";
                return helpers::resStruct(false, $msg);
            }
            $prices = $api->prices();            
        }
        
        $daily_profits_values = $this->_getDailyProfitsValues($user_code, $prices, $date);
        
        return helpers::resStruct(false, "", $daily_profits_values);
    }
    
    private function _getDailyProfitsValues($user_code, $prices, $date = null)
    {
        if (is_null($date))
        {
            $date = date('Y-m-d');
        }
        
        $report_balance_controller = new reportProfit();
        $balance = $report_balance_controller->getFiltered(array(
            'start_date' => $date,
            'end_date' => $date,
            'is_training' => false,
            'user_code' => $user_code,
            'prices' => $prices
        ))['data'];
        
        $sum_profit_usdt = 0;
        $sum_total_commission_usdt = 0;
        $sum_total_profit_usdt = 0;
        $sum_total_profit_perc = 0;
        $counter_total_profit_perc = 0;
        $sum_total_profit_btc_now = 0;
        $sum_total_profit_eth_now = 0;
        $sum_total_profit_bnb_now = 0;
        $sum_total_profit_xrp_now = 0;
        $sum_total_profit_usdt_now = 0;
        $sum_total_profit_usdc_now = 0;
        $sum_total_market_profit_btc = 0;
        $sum_total_market_profit_eth = 0;
        $sum_total_market_profit_bnb = 0;
        $sum_total_market_profit_xrp = 0;
        $sum_total_market_profit_usdt = 0;
        $sum_buyings = 0;
        $sum_trades = 0;
        
        if (!empty($balance))
        {
            foreach ($balance as $values)
            {
                $sum_profit_usdt += $values['profit_usdt'];
                $sum_total_commission_usdt += $values['total_commission_usdt'];
                $sum_total_profit_usdt += $values['total_profit_usdt'];

                if ($values['positive'])
                {
                    $sum_total_profit_perc += $values['total_profit_perc'];
                    $counter_total_profit_perc++;
                }

                $sum_total_profit_btc_now += $values['total_profit_btc_now'];
                $sum_total_profit_eth_now += $values['total_profit_eth_now'];
                $sum_total_profit_bnb_now += $values['total_profit_bnb_now'];
                $sum_total_profit_xrp_now += $values['total_profit_xrp_now'];
                $sum_total_profit_usdt_now += $values['total_profit_usdt_now'];
                $sum_total_profit_usdc_now += $values['total_profit_usdc_now'];
                
                $sum_total_market_profit_btc += $values['total_market_profit_btc'];
                $sum_total_market_profit_eth += $values['total_market_profit_eth'];
                $sum_total_market_profit_bnb += $values['total_market_profit_bnb'];
                $sum_total_market_profit_xrp += $values['total_market_profit_xrp'];
                $sum_total_market_profit_usdt += $values['total_market_profit_usdt'];
                
                $sum_buyings += $values['buyings'];
                $sum_trades += $values['trades'];
            }
        }
        
        $av_total_profit_perc = ($counter_total_profit_perc == 0)? 0 : ($sum_total_profit_perc / $counter_total_profit_perc);

        return array(
            'sum_profit_usdt' => $sum_profit_usdt,
            'sum_total_commission_usdt' => $sum_total_commission_usdt,
            'sum_total_profit_usdt' => $sum_total_profit_usdt,
            'sum_total_profit_perc' => $sum_total_profit_perc,
            'counter_total_profit_perc' => $counter_total_profit_perc,
            
            'sum_total_profit_btc_now' => $sum_total_profit_btc_now,
            'sum_total_profit_eth_now' => $sum_total_profit_eth_now,
            'sum_total_profit_bnb_now' => $sum_total_profit_bnb_now,
            'sum_total_profit_xrp_now' => $sum_total_profit_xrp_now,
            'sum_total_profit_usdt_now' => $sum_total_profit_usdt_now,
            'sum_total_profit_usdc_now' => $sum_total_profit_usdc_now,
            
            'sum_total_market_profit_btc' => $sum_total_market_profit_btc,
            'sum_total_market_profit_eth' => $sum_total_market_profit_eth,
            'sum_total_market_profit_bnb' => $sum_total_market_profit_bnb,
            'sum_total_market_profit_xrp' => $sum_total_market_profit_xrp,
            'sum_total_market_profit_usdt' => $sum_total_market_profit_usdt,
            'sum_buyings' => $sum_buyings,
            'sum_trades' => $sum_trades,
            'av_total_profit_perc' => $av_total_profit_perc
        );
    }
    
    private function _getRealBalanceValues($account, $prices)
    {
        $real_balances = array();
        $real_balance_total_btc = 0;
        foreach ($account['balances'] as $values)
        {
            $coin = $values['asset'];
            $free = $values['free'];
            $locked = $values['locked'];
            $amount = $free + $locked;
            
//            // Test
//            if ($coin === 'USDC')
//            {
//                $test = true;
//            }
            
            if ($amount == 0)
            {
                continue;
            }
            
            $amount_btc = $this->_getBTCValue($amount, $coin, $prices);
            if (is_null($amount_btc))
            {
                continue;
            }
            
            $real_balances[$coin] = array(
                'amount' => $amount,
                'amount_btc' => $amount_btc,
                'amount_usdt' => $amount_btc * $prices["BTCUSDT"]
            );
            $real_balance_total_btc += $amount_btc;
        }        
        
        $real_balance_total_usdt = $real_balance_total_btc * $prices["BTCUSDT"];
        $real_balance_chart = array();
        $real_btcs_by_coin = array();
        $total_coins = count($real_balances);
        foreach ($real_balances as $coin => $values)
        {
            $btcs = $values['amount_btc'];
            $perc = ($btcs * 100) / $real_balance_total_btc;
            $real_balance_chart[] = array(
                'coin' => $coin,
                'perc' => $perc, 
                'btcs' => $btcs, 
                'usdt' => $values['amount_usdt']
            );
            $real_btcs_by_coin[$coin] = $btcs;
        }
        
        return array(
            'real_balance_total_btc' => $real_balance_total_btc,
            'real_balance_total_usdt' => $real_balance_total_usdt,
            'real_balance_chart' => $real_balance_chart,
            'real_balance_numer_of_coins' => $total_coins,   
            'real_btcs_by_coin' => $real_btcs_by_coin
        );
    }
    
    private function _getFloatingValues($user_code, $prices, $real_btcs_by_coin, $floating_showfree)
    {
        // Get floating
        $floating_controller = new floating();
        $floating_transactions = $floating_controller->getFiltered(array(
            'is_training' => false,
            'user_code' => $user_code,
            'calculate_profits' => false,
            'prices' => json_encode($prices)
        ))['data'];
        $floating = array();
        $floating_by_coin = array();
        $floating_total_btc = 0;
        foreach ($floating_transactions as $transaction)
        {
            $coin = $transaction['coin'];
            $market_coin = $transaction['market_coin'];
            $amount =  (float) $transaction['amount'];
            
            if (!isset($floating[$market_coin]))
            {
                $floating[$market_coin] = array(
                    'by_coin' => array(),
                    'total_btc' => 0
                );
            }
            if (!isset($floating[$market_coin]['by_coin'][$coin]))
            {
                $floating[$market_coin]['by_coin'][$coin] = array(
                    'amount' => 0,
                    'amount_btc' => 0                        
                );              
            }
            if (!isset($floating_by_coin[$coin]))
            {
                $floating_by_coin[$coin] = array(
                    'amount' => 0,
                    'amount_btc' => 0                        
                );
            }
            
            $floating[$market_coin]['by_coin'][$coin]['amount'] += $amount;
            $floating_by_coin[$coin]['amount'] += $amount;
            
            $amount_btc = $this->_getBTCValue($amount, $coin, $prices);
            if (is_null($amount_btc))
            {
                continue;
            }
            
            $floating[$market_coin]['by_coin'][$coin]['amount_btc'] += $amount_btc;
            $floating_by_coin[$coin]['amount_btc'] += $amount_btc;
            $floating[$market_coin]['total_btc'] += $amount_btc;
            $floating_total_btc += $amount_btc;
        }
        
        // Check diff (test)
        /*foreach ($real_btcs_by_coin as $coin => $btcs)
        {
            if (!isset($floating_by_coin[$coin]))
            {
                continue;
            }
            if (!isset($floating_by_coin[$coin]['amount_btc']))
            {
                continue;
            }
            
            $floating_btcs = $floating_by_coin[$coin]['amount_btc'];
            
            $diff_btc = $btcs - $floating_btcs;
            $diff_usdt = $diff_btc * $prices["BTCUSDT"];
            if ($diff_usdt < 0)
            {
                $ups = true;
            }
            if ($diff_usdt > 1)
            {
                $ups = true;
            }
        }*/
        
        // Sort by total btc
        $floating_total = array();
        foreach ($floating as $market_coin => $floating_data_by_mkc)
        {
            $total_btc = $floating_data_by_mkc['total_btc'];
            // Add free
            if (isset($real_btcs_by_coin[$market_coin]))
            {
                $free_btcs = $real_btcs_by_coin[$market_coin];
                $total_btc += $free_btcs;
            }
            $floating_total[] = array(
                'market_coin' => $market_coin,
                'total_btc' => $total_btc
            );
        }
        if (!empty($floating_total))
        {
            $floating_total = helpers::sortArrayByField($floating_total, "total_btc", SORT_DESC);
            $floating_total_order_by_mkc = array();
            foreach ($floating_total as $order => $values)
            {
                $market_coin = $values['market_coin'];
                $floating_total_order_by_mkc[$market_coin] = $order;
            }
        }
        
        $floating_total_usdt = $floating_total_btc * $prices["BTCUSDT"];
        $floating_chart = array();
        foreach ($floating as $market_coin => $floating_data_by_mkc)
        {
            $market_values = $floating_data_by_mkc['by_coin'];
            foreach ($market_values as $coin => $values)
            {
                $btcs = $values['amount_btc'];
                $floating_chart[] = array(
                    'coin' => $coin,
                    'market_coin' => $market_coin, 
                    'btcs' => $btcs,
                    'usdt' => $btcs * $prices["BTCUSDT"],
                    'market_coin_order' => $floating_total_order_by_mkc[$market_coin]
                );
            }
        }

        // Add free
        if ($floating_showfree)
        {
            $marketcoin_controller = new marketCoin();
            $market_coins = $marketcoin_controller->getFiltered(array('user_code' => $user_code))['data'];
            $market_coin_order_counter = 100;
            foreach ($market_coins as $values)
            {
                $market_coin = $values['code'];

                if (!isset($real_btcs_by_coin[$market_coin]))
                {
                    continue;
                }

                $free_btcs = $real_btcs_by_coin[$market_coin];
                if (isset($floating_total_order_by_mkc[$market_coin]))
                {
                    $market_coin_order = $floating_total_order_by_mkc[$market_coin];
                }
                else
                {
                    $market_coin_order = $market_coin_order_counter;
                    $market_coin_order_counter++;
                }

                $floating_chart[] = array(
                    'coin' => 'FREE',
                    'market_coin' => $market_coin, 
                    'btcs' => $free_btcs,
                    'usdt' => $free_btcs * $prices["BTCUSDT"],
                    'market_coin_order' => $market_coin_order,
                    'color' => 'lightskyblue'
                );            
            }            
        }

        if (!empty($floating_chart))
        {
//            $floating_chart = helpers::sortArrayByMultipleFields($floating_chart, array('market_coin' => 'asc', 'btcs' => 'desc'));
            $floating_chart = helpers::sortArrayByField($floating_chart, "btcs", SORT_DESC);
        }        
        
        return array(
            'floating_total_btc' => $floating_total_btc,
            'floating_total_usdt' => $floating_total_usdt,
            'floating_chart' => $floating_chart              
        );
    }
    
    private function _getChangeTimeValues($change_time_chart_btc, $change_time_chart_alts)
    {
        $candlestick_interval = '15';
        $months = 12;
        
        $sample00h_controller = new sample00h();
        $sample_controller = new sample();
        $symbol_controller = new symbol();
        
        // Get samples at 00h
        $start_date = date('Y-m-d', strtotime("-$months months")).' 00:00:00';
        $end_date = date('Y-m-d H:i:s');
        $samples00h = $sample00h_controller->getSamples($candlestick_interval, $start_date, $end_date);
        
        // Add last sample
        $added_last_sample = false;
        $sample_now = $sample_controller->getLastSample($candlestick_interval);
        if (!empty($sample_now))
        {
            $samples00h[] = $sample_now;
            $added_last_sample = true;
        }
        
        $symbols = array();
        $samples_by_date = array();
                
        $total_samples = count($samples00h);
        foreach ($samples00h as $key => $sample)
        {
            $sample_date = $sample['sample_date'];
            $samples_values = $sample['samples_values'];
            
            if (empty($symbols))
            {
                foreach ($samples_values as $symbol => $prices_values)
                {   
                    array_push($symbols, $symbol);
                }
            }
            
            $values = array();
            foreach ($symbols as $symbol) {
                
                if (isset($samples_values[$symbol]) && isset($samples_values[$symbol]['close']))
                {
                    $value = $samples_values[$symbol]['close'];
                }
                else
                {
                    $value = 0;
                }
                $values[$symbol] = $value;
            }

            if ($added_last_sample && $key >= ($total_samples -1))
            {
                $date = 'Now';
            }
            else
            {
                $date = date('Y-m-d', strtotime($sample_date));
            }
            
            $samples_by_date[$date] = $values;
        }
        
        // Get result
        $change_time_chart = array();
        $accumulated_value = 0;
        $change_time_by_marketcoin_chart = array();
        $accumulated_value_btc = 0;
        $accumulated_value_eth = 0;
        $accumulated_value_bnb = 0;
        $accumulated_value_xrp = 0;
        $accumulated_value_usdt = 0;
        $last_values = array();
        $first_values = array();
        foreach ($samples_by_date as $date => $values)
        {
            $diff_to_previous_value = 0;
            $diff_to_previous_value_btc = 0;
            $diff_to_previous_value_eth = 0;
            $diff_to_previous_value_bnb = 0;
            $diff_to_previous_value_xrp = 0;
            $diff_to_previous_value_usdt = 0;
            
            $diff_to_first_value = 0;
            $diff_to_first_value_btc = 0;
            $diff_to_first_value_eth = 0;
            $diff_to_first_value_bnb = 0;
            $diff_to_first_value_xrp = 0;
            $diff_to_first_value_usdt = 0;
            
            if (!empty($last_values))
            {
                $diff_to_previous_sum = 0;
                $diff_to_previous_sum_btc = 0;
                $diff_to_previous_sum_eth = 0;
                $diff_to_previous_sum_bnb = 0;
                $diff_to_previous_sum_xrp = 0;
                $diff_to_previous_sum_usdt = 0;
                $diff_to_previous_counter = 0;
                $diff_to_previous_counter_btc = 0;
                $diff_to_previous_counter_eth = 0;
                $diff_to_previous_counter_bnb = 0;
                $diff_to_previous_counter_xrp = 0;
                $diff_to_previous_counter_usdt = 0;
                
                $diff_to_first_sum = 0;
                $diff_to_first_sum_btc = 0;
                $diff_to_first_sum_eth = 0;
                $diff_to_first_sum_bnb = 0;
                $diff_to_first_sum_xrp = 0;
                $diff_to_first_sum_usdt = 0;
                $diff_to_first_counter = 0;
                $diff_to_first_counter_btc = 0;
                $diff_to_first_counter_eth = 0;
                $diff_to_first_counter_bnb = 0;
                $diff_to_first_counter_xrp = 0;
                $diff_to_first_counter_usdt = 0;
                
                foreach ($values as $symbol => $price)
                {
                    $market_coin = $symbol_controller->getMarketCoin($symbol);
                    
                    // Last price vs previous sample
                    $last_price_vs_previous_sample = $last_values[$symbol];
                    if ($last_price_vs_previous_sample === 0)
                    {
                        $change_perc_vs_previous_sample = 0;
                    }
                    else
                    {
                        $price_diff = $price - $last_price_vs_previous_sample;
                        $change_perc_vs_previous_sample = ($price_diff / $last_price_vs_previous_sample) * 100;
                    }
                    
                    // Last price vs first sample
                    $last_price_vs_first_sample = $first_values[$symbol];
                    if ($last_price_vs_first_sample === 0)
                    {
                        $change_perc_vs_first_sample = 0;
                    }
                    else
                    {
                        $price_diff = $price - $last_price_vs_first_sample;
                        $change_perc_vs_first_sample = ($price_diff / $last_price_vs_first_sample) * 100;
                    }
                    
                    $must_sum = true;
                    $coin = $symbol_controller->getCoin($symbol);
                    if ($coin === 'BTC')
                    {
                        if (!$change_time_chart_btc)
                        {
                            $must_sum = false;
                        }
                    }
                    else
                    {
                        if (!$change_time_chart_alts)
                        {
                            $must_sum = false;
                        }
                    }
                    if ($must_sum)
                    {
                        $diff_to_previous_sum += $change_perc_vs_previous_sample;
                        $diff_to_previous_counter++;
                        $diff_to_first_sum += $change_perc_vs_first_sample;
                        $diff_to_first_counter++;
                    }                    
                    
                    if ($market_coin === 'BTC')
                    {
                        $diff_to_previous_sum_btc += $change_perc_vs_previous_sample;
                        $diff_to_previous_counter_btc++;
                        $diff_to_first_sum_btc += $change_perc_vs_first_sample;
                        $diff_to_first_counter_btc++;
                    }
                    elseif ($market_coin === 'ETH')
                    {
                        $diff_to_previous_sum_eth += $change_perc_vs_previous_sample;
                        $diff_to_previous_counter_eth++;
                        $diff_to_first_sum_eth += $change_perc_vs_first_sample;
                        $diff_to_first_counter_eth++;
                    }
                    elseif ($market_coin === 'BNB')
                    {
                        $diff_to_previous_sum_bnb += $change_perc_vs_previous_sample;
                        $diff_to_previous_counter_bnb++;
                        $diff_to_first_sum_bnb += $change_perc_vs_first_sample;
                        $diff_to_first_counter_bnb++;
                    }
                    elseif ($market_coin === 'XRP')
                    {
                        $diff_to_previous_sum_xrp += $change_perc_vs_previous_sample;
                        $diff_to_previous_counter_xrp++;
                        $diff_to_first_sum_xrp += $change_perc_vs_first_sample;
                        $diff_to_first_counter_xrp++;
                    }
                    elseif ($market_coin === 'USDT')
                    {
                        $diff_to_previous_sum_usdt += $change_perc_vs_previous_sample;
                        $diff_to_previous_counter_usdt++;
                        $diff_to_first_sum_usdt += $change_perc_vs_first_sample;
                        $diff_to_first_counter_usdt++;
                    }
                }
                if ($diff_to_previous_counter > 0) $diff_to_previous_value = $diff_to_previous_sum / $diff_to_previous_counter;
                if ($diff_to_previous_counter_btc > 0) $diff_to_previous_value_btc = $diff_to_previous_sum_btc / $diff_to_previous_counter_btc;
                if ($diff_to_previous_counter_eth > 0) $diff_to_previous_value_eth = $diff_to_previous_sum_eth / $diff_to_previous_counter_eth;
                if ($diff_to_previous_counter_bnb > 0) $diff_to_previous_value_bnb = $diff_to_previous_sum_bnb / $diff_to_previous_counter_bnb;
                if ($diff_to_previous_counter_xrp > 0) $diff_to_previous_value_xrp = $diff_to_previous_sum_xrp / $diff_to_previous_counter_xrp;
                if ($diff_to_previous_counter_usdt > 0) $diff_to_previous_value_usdt = $diff_to_previous_sum_usdt / $diff_to_previous_counter_usdt;

                if ($diff_to_first_counter > 0) $diff_to_first_value = $diff_to_first_sum / $diff_to_first_counter;
                if ($diff_to_first_counter_btc > 0) $diff_to_first_value_btc = $diff_to_first_sum_btc / $diff_to_first_counter_btc;
                if ($diff_to_first_counter_eth > 0) $diff_to_first_value_eth = $diff_to_first_sum_eth / $diff_to_first_counter_eth;
                if ($diff_to_first_counter_bnb > 0) $diff_to_first_value_bnb = $diff_to_first_sum_bnb / $diff_to_first_counter_bnb;
                if ($diff_to_first_counter_xrp > 0) $diff_to_first_value_xrp = $diff_to_first_sum_xrp / $diff_to_first_counter_xrp;
                if ($diff_to_first_counter_usdt > 0) $diff_to_first_value_usdt = $diff_to_first_sum_usdt / $diff_to_first_counter_usdt;                
            }
            
            $accumulated_value += $diff_to_previous_value;
            $accumulated_value_btc += $diff_to_previous_value_btc;
            $accumulated_value_eth += $diff_to_previous_value_eth;
            $accumulated_value_bnb += $diff_to_previous_value_bnb;
            $accumulated_value_xrp += $diff_to_previous_value_xrp;
            $accumulated_value_usdt += $diff_to_previous_value_usdt;                

            $change_time_chart[] = array(
                'date' => $date,
                'diff_to_previous_value' => round($diff_to_previous_value, 2),
                "diff_to_previous_value_zero" => 0.0,
                //'accumulated_value' => round($accumulated_value, 2),
                'accumulated_value' => round($diff_to_first_value, 2),
                "accumulated_value_zero" => 0.0
            );

            $change_time_by_marketcoin_chart[] = array(
                'date' => $date,
                
                /*'accumulated_value_btc' => round($accumulated_value_btc, 2),
                'accumulated_value_eth' => round($accumulated_value_eth, 2),
                'accumulated_value_bnb' => round($accumulated_value_bnb, 2),
                'accumulated_value_xrp' => round($accumulated_value_xrp, 2),
                'accumulated_value_usdt' => round($accumulated_value_usdt, 2),
                */
                
                'accumulated_value_btc' => round($diff_to_first_value_btc, 2),
                'accumulated_value_eth' => round($diff_to_first_value_eth, 2),
                'accumulated_value_bnb' => round($diff_to_first_value_bnb, 2),
                'accumulated_value_xrp' => round($diff_to_first_value_xrp, 2),
                'accumulated_value_usdt' => round($diff_to_first_value_usdt, 2),
                
                "accumulated_value_zero" => 0.0
            );
            
            if (empty($first_values)) $first_values = reset($samples_by_date);
            $last_values = $values;
        }
        
        // Calculate change time 24h now!
        $change_time_now = 0;
        $dt = date('Y-m-d H:i:s', strtotime("-1 day"));
        $sample_1dayless = $sample_controller->getSample($candlestick_interval, $dt);
        if (!empty($sample_now) && !empty($sample_1dayless))
        {
            $samples_values_sample_now = $sample_now['samples_values'];
            $samples_values_1dayless = $sample_1dayless['samples_values'];
            
            $sum = 0;
            $counter = 0;
            
            foreach ($symbols as $symbol) 
            {
                $price = (isset($samples_values_sample_now[$symbol]) && isset($samples_values_sample_now[$symbol]['close']))? $samples_values_sample_now[$symbol]['close'] : 0;
                $last_price = (isset($samples_values_1dayless[$symbol]) && isset($samples_values_1dayless[$symbol]['close']))? $samples_values_1dayless[$symbol]['close'] : 0;
                if ($last_price === 0)
                {
                    continue;
                }
                $price_diff = $price - $last_price;
                $change_perc = ($price_diff / $last_price) * 100;
                $sum += $change_perc;
                
                $counter++;
            }
            
            $change_time_now = $sum / $counter;           
        }
                
        return array(
            'change_time_now' => round($change_time_now, 2),
            'change_time_chart' => $change_time_chart,
            'change_time_by_marketcoin_chart' => $change_time_by_marketcoin_chart          
        );
    }
    
}
