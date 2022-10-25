<?php

namespace modules\cryptos\controller;

// Controllers
use modules\cryptos\controller\wildTrainingGroup;
use modules\cryptos\controller\reportProfit;

/**
 * Release robots controller
 *
 * @author Dani Gilabert
 */
class releaseRobots
{
    
    public function getBestBalancesByWTGroup($today = null)
    {
        $ret = array();
        
        $number_of_days = array(
            'min' => 2,
            'max' => 30,
            'step' => 2
        );
        
        // Get wt groups
        $wt_group_controller = new wildTrainingGroup();
        $wt_groups = $wt_group_controller->getFiltered(array())['data'];
        foreach ($wt_groups as $wt_group)
        {
            $wt_group_code = $wt_group['code'];
            
            $ret[$wt_group_code] = array();
            $best_balances = array();
            $best_balance_result = 0;
                
            $min = $number_of_days['min'];
            $max = $number_of_days['max'];
            $step = $number_of_days['step'];

            for ($nod=$min; $nod<=$max; $nod+=$step)
            {
                $balances = $this->_getBalances($wt_group_code, $nod, $today);
                
                $best_balcs = array();
                foreach ($balances as $balance)
                {
                    if (!$balance['positive'])
                    {
                        continue;
                    }
                    if ($balance['hits'] <= 1)
                    {
                        continue;
                    }
                    if ($balance['hits_perc'] <= 50)
                    {
                        continue;
                    }
                    
                    $best_balcs[] = $balance;
                }
                
                // Sum best results
                $hits_perc = 0;
                $times = 0;
                $total_profit_usdt = 0;
                if (!empty($best_balcs))
                {
                    foreach ($best_balcs as $balance)
                    {
                        $hits_perc += $balance['hits_perc'];
                        $times++;
                        $total_profit_usdt += $balance['total_profit_usdt'];
                    }
                    $hits_perc = $hits_perc / $times;
                    
                    if ($total_profit_usdt > $best_balance_result)
                    {
                        $best_balances = array(
                            'best_balances' => $best_balcs,
                            'nod' => $nod,
                            'hits_perc' => $hits_perc,
                            'total_profit_usdt' => $total_profit_usdt,
                            
                        );
                        $best_balance_result = $total_profit_usdt;
                    }                    
                }
            }
            
            if (empty($best_balances))
            {
                continue;
            }
            
            $ret[$wt_group_code] = $best_balances;
        }
        
        return $ret;
    }
    
    private function _getBalances($wt_group_code, $number_of_days, $today = null)
    {
        if (is_null($today))
        {
            $today = date('Y-m-d');
        }
        $start_date = date('Y-m-d', strtotime("-$number_of_days days", strtotime($today)));
        $end_date = $today;
        
        $balance_controller = new reportProfit();
        return $balance_controller->getFiltered(array(
            'start_date' => $start_date,
            'end_date' => $end_date,
            'is_training' => true,
            'wt_group_code' => $wt_group_code
        ))['data'];
    }    
    
  
}
