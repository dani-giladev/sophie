<?php

namespace modules\cryptos\robot;

// Controllers
use modules\cryptos\robot\common;
use modules\cryptos\robot\store;

/**
 *
 * @author Dani Gilabert
 * 
 */

class filtering extends common
{

    public function calculateRobotTrack($user, $robot)
    {
        $robot_track_value = $this->getRobotTrackValue($user, $robot);
        $coinpair = $robot['coinpair'];
        
        $filter_values = $this->_getFilterValues($user, $robot);
        
        $filter_type = $filter_values['filter_type'];
        $this->setRobotValue($user, $robot, 'filter_type', $filter_type);
        $filter_factor = $filter_values['filter_factor'];
        $this->setRobotValue($user, $robot, 'filter_factor', $filter_factor);
        
        $samples = $this->getSamples($user, $robot);
        $last_sample = end($samples);
                
        $filtered_value = $this->filterSample($robot_track_value, $last_sample, $coinpair, $filter_type, $filter_factor);
        
        $this->setRobotTrackValue($user, $robot, $filtered_value);
    }

    public function calculateIndicatorsValues($user, $robot, $indicators = array(), $enable_even_if_disabled = false)
    {
        $all_samples = store::getSamples();
        $last_sample = store::getLastSample();
        $coinpair = $robot['coinpair'];

        // Set filters
        $filter_keys = array();
        if ((empty($indicators) || in_array('ma', $indicators)) && ($this->_robot_controller->isIndicatorEnabledToBuy($robot, 'ma') || $enable_even_if_disabled))
        {
            array_push($filter_keys, 'ma_fast', 'ma_slow');
        }
        if ((empty($indicators) || in_array('macd', $indicators)) && ($this->_robot_controller->isIndicatorEnabledToBuy($robot, 'macd') || $this->_robot_controller->isIndicatorEnabledToSell($robot, 'macd') || $enable_even_if_disabled))
        {
            array_push($filter_keys, 'macd_macd1', 'macd_macd2');
        }
        if ((empty($indicators) || in_array('volume', $indicators)) && ($this->_robot_controller->isIndicatorEnabledToBuy($robot, 'volume') || $enable_even_if_disabled))
        {
            array_push($filter_keys, 'volume_fast', 'volume_slow');
        }
        if (!empty($filter_keys))
        {
            foreach ($filter_keys as $filter_key)
            {
                $filter_values = $this->getFilterValues($user, $robot, $filter_key);
                $filter_price = (strpos($filter_key, 'volume') === false);
                $filter_values['filter_value'] = $this->filterSample($filter_values['filter_value'], $last_sample, $coinpair, $filter_values['filter_type'], $filter_values['filter_factor'], $filter_price);
                $this->setFilterValues($user, $robot, $filter_key, $filter_values);
            }            
        }
        
        // MACD
        if ((empty($indicators) || in_array('macd', $indicators)) && ($this->_robot_controller->isIndicatorEnabledToBuy($robot, 'macd') || $this->_robot_controller->isIndicatorEnabledToSell($robot, 'macd') || $enable_even_if_disabled))
        {
            $macd_macd1_value = $this->getFilterValues($user, $robot, 'macd_macd1')['filter_value'];
            $macd_macd2_value = $this->getFilterValues($user, $robot, 'macd_macd2')['filter_value'];
            $macd_signal_filter_values = $this->getFilterValues($user, $robot, 'macd_signal');
            // Calculate macd and signal
            $macd_value = $macd_macd1_value - $macd_macd2_value;
            $macd_signal_filter_values['filter_value'] = $this->filter($macd_signal_filter_values['filter_value'], $macd_value, $macd_signal_filter_values['filter_type'], $macd_signal_filter_values['filter_factor']);
            $macdh_value = $macd_value - $macd_signal_filter_values['filter_value'];
            // Set robot values
            $this->setRobotValue($user, $robot, 'macd', $macd_value);
            $this->setFilterValues($user, $robot, 'macd_signal', $macd_signal_filter_values);
            $this->setRobotValue($user, $robot, 'macdh', $macdh_value);
        }
        
        // RSI
        if ((empty($indicators) || in_array('rsi', $indicators)) && ($this->_robot_controller->isIndicatorEnabledToBuy($robot, 'rsi') || $enable_even_if_disabled))
        {
            $rsi_periods = $this->_robot_controller->getValue($robot, 'rsi_periods');
            $rsi_smoothed = $this->_robot_controller->getValue($robot, 'rsi_smoothed');
            $rsi_signal_filter_values = $this->getFilterValues($user, $robot, 'rsi_signal');
            // Calculate RSI
            $rsi_up_down_values = $this->getRSI_Up_Down_Values($all_samples, $user, $robot);
            // Up
            $rsi_up_value = $rsi_up_down_values['up'];
            $previous_rsi_up_filter_value = $this->getRobotValue($user, $robot, 'rsi_up');
            $rsi_up_filter_value = $this->filter($previous_rsi_up_filter_value, $rsi_up_value, "ema", $rsi_periods);
            // Down
            $rsi_down_value = $rsi_up_down_values['down'];
            $previous_rsi_down_filter_value = $this->getRobotValue($user, $robot, 'rsi_down');
            $rsi_down_filter_value = $this->filter($previous_rsi_down_filter_value, $rsi_down_value, "ema", $rsi_periods);

            // Get RSI
            $rsi_value = $this->rsi(
                    // Up
                    $previous_rsi_up_filter_value,
                    $rsi_up_filter_value,
                    $rsi_up_value,
                    // Down
                    $previous_rsi_down_filter_value,
                    $rsi_down_filter_value,
                    $rsi_down_value,

                    $rsi_periods, $rsi_smoothed);
            // RSI Signal
            $rsi_signal_filter_values['filter_value'] = $this->filter($rsi_signal_filter_values['filter_value'], $rsi_value, $rsi_signal_filter_values['filter_type'], $rsi_signal_filter_values['filter_factor']);
            // Set robot values  
            $this->setRobotValue($user, $robot, 'rsi_up', $rsi_up_filter_value);  
            $this->setRobotValue($user, $robot, 'rsi_down', $rsi_down_filter_value);   
            $this->setRobotValue($user, $robot, 'rsi', $rsi_value);        
            $this->setFilterValues($user, $robot, 'rsi_signal', $rsi_signal_filter_values);
        }
        
        // OBV
        if ((empty($indicators) || in_array('obv', $indicators)) && ($this->_robot_controller->isIndicatorEnabledToBuy($robot, 'obv') || $enable_even_if_disabled))
        {
            $obv_fast_filter_values = $this->getFilterValues($user, $robot, 'obv_fast');
            $obv_slow_filter_values = $this->getFilterValues($user, $robot, 'obv_slow');
            // Calculate OBV
            $previous_obv = $this->getRobotValue($user, $robot, 'obv');
            $obv_value = $this->obv($previous_obv, $all_samples, $user, $robot);
            $obv_fast_filter_values['filter_value'] = $this->filter($obv_fast_filter_values['filter_value'], $obv_value, $obv_fast_filter_values['filter_type'], $obv_fast_filter_values['filter_factor']);
            $obv_slow_filter_values['filter_value'] = $this->filter($obv_slow_filter_values['filter_value'], $obv_value, $obv_slow_filter_values['filter_type'], $obv_slow_filter_values['filter_factor']);
            // Set robot values
            $this->setRobotValue($user, $robot, 'obv', $obv_value);
            $this->setFilterValues($user, $robot, 'obv_fast', $obv_fast_filter_values);
            $this->setFilterValues($user, $robot, 'obv_slow', $obv_slow_filter_values);
        }
        
    }
    
    private function _getFilterValues($user, $robot)
    {
        $default_filter_type = $robot['filter_type'];
        $default_filter_factor = $robot['filter_factor'];
        $takeoff_filter_type = $robot['takeoff_filter_type'];
        $takeoff_filter_factor = $robot['takeoff_filter_factor'];
        $stoploss_filter_type = $robot['stoploss_filter_type'];
        $stoploss_filter_factor = $robot['stoploss_filter_factor'];
        
        $last_operation = $this->_robot_controller->getLastOperation($robot);
        $current_filter_factor = $this->getRobotValue($user, $robot, 'filter_factor');
        
        $new_filter_type = $default_filter_type;
        $new_filter_factor = $default_filter_factor;
        
        if ($last_operation === 'buy')
        {
            // Robot is trying to sell
            $robot_track_value = $this->getRobotTrackValue($user, $robot);
            $buying_prices = $this->getBuyingPrices($user, $robot);
            $buying_price = $buying_prices['price'];
            //$buying_price_of_robot_track = $buying_prices['robot_track_value'];            
            $real_value = $this->getPriceOfLastSample($robot, true);
            if ($robot_track_value < $buying_price && $robot_track_value > $real_value)
            {
                // Stop-loss
                if (!empty($stoploss_filter_type))
                {
                    $new_filter_type = $stoploss_filter_type;
                } 
                if (!empty($stoploss_filter_factor))
                {
                    $new_filter_factor = $stoploss_filter_factor;
                }                
            }
        }
        else
        {
            // Robot is trying to buy
            if (!empty($takeoff_filter_type))
            {
                $new_filter_type = $takeoff_filter_type;
            } 
            if (!empty($takeoff_filter_factor))
            {
                $new_filter_factor = $takeoff_filter_factor;
            }            
        }
        
        if ($new_filter_factor != $current_filter_factor)
        {
            $samples = $this->getSamples($user, $robot);
            $number_of_samples_to_remove = count($samples) - $new_filter_factor;
            if ($number_of_samples_to_remove > 0)                
            {
                $samples = array_slice($samples, $number_of_samples_to_remove); 
                $this->setSamples($user, $robot, $samples);
            }
        }        
        
        return array(
            'filter_type' => $new_filter_type,
            'filter_factor' => $new_filter_factor
        );
    }

    public function filterSample($filtered_value, $sample, $coinpair, $filter_type, $filter_factor, $filter_price = true)
    {
        if ($filter_price)
        {
            $datapoint = $this->getPrice($sample, $coinpair);
        }
        else
        {
            $datapoint = $this->getVolume($sample, $coinpair);
        }
        
        if (!isset($filtered_value))
        {
            $filtered_value = $datapoint;
        }        
        
        return $this->ma($datapoint, $filtered_value, $filter_factor, $filter_type);
    }

    public function filter($filtered_value, $datapoint, $filter_type, $filter_factor)
    {
        if (!isset($filtered_value))
        {
            $filtered_value = $datapoint;
        }        
        
        return $this->ma($datapoint, $filtered_value, $filter_factor, $filter_type);
    }
    
    public function ma($datapoint, $average, $count, $filter_type)
    {
        if ($filter_type == "ema")
        {
            // Exponential Moving Average
            return $this->ema($datapoint, $average, $count);
        }
        else
        {
            // Simple Moving Average
            return $this->sma($datapoint, $average, $count);
        }
    }
    
    /*
     * https://trog.qgl.org/20091214/cumulative-moving-average-in-php/ 
     */
    public function sma($datapoint, $average, $count)
    {
        //$datapoint = $this->normalizeFloatValue($datapoint);
        //$average = $this->normalizeFloatValue($average);
        
        if (!is_numeric($datapoint) && !is_numeric($average))
        {
            return 0;
        }
        if (!is_numeric($datapoint))
        {
            return $average;
        }
        if (!is_numeric($average))
        {
            return $datapoint;
        }
        
        return $average + (($datapoint - $average) /  $count);
    }   
    
    /*
     * http://www.nostradermus.com/index.php/pt/13-indicadores-tecnicos/40-media-movil-exponencial-ema-exponential-moving-average
     * EMAactual= EMAanterior + [2/(n+1)] * [Precioactual - EMAanterior]
     * 
     * 
     * http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:moving_averages:
     * Multiplier: (2 / (Time periods + 1) )
     * EMA: {Close - EMA(previous day)} x multiplier + EMA(previous day).          
     * 
     * 
     * https://www.dummies.com/personal-finance/investing/stocks-trading/how-to-calculate-exponential-moving-average-in-trading/
     * EMA [today] = (Price [today] x K) + (EMA [yesterday] x (1 – K))
     */    
    public function ema($datapoint, $previous_ema, $count)
    {
        //$datapoint = $this->normalizeFloatValue($datapoint);
        //$previous_ema = $this->normalizeFloatValue($previous_ema);
        
        if (!is_numeric($datapoint) && !is_numeric($previous_ema))
        {
            return 0;
        }
        if (!is_numeric($datapoint))
        {
            return $previous_ema;
        }
        if (!is_numeric($previous_ema))
        {
            return $datapoint;
        }
        
        return $previous_ema + (2 / ($count + 1)) * ($datapoint - $previous_ema);
    }

    /*
     * https://www.rankia.com/blog/formacion-bolsa/3708112-descubriendo-indicador-rsi-operativa-ejemplo
     * http://cns.bu.edu/~gsc/CN710/fincast/Technical%20_indicators/Relative%20Strength%20Index%20(RSI).htm
     */
    public function getRSI_Up_Down_Values($all_samples, $user, $robot)
    {
        $number_of_samples = count($all_samples);
        if ($number_of_samples < 2)
        {
            return array(
                'up' => 0,
                'down' => 0,
            );
        }
        
        $coinpair = $robot['coinpair'];
        $user_code = $user['userdata']['code'];
        $robot_code = $robot['code'];
        
        $sample = $all_samples[$number_of_samples - 1];
        $previous_sample = $all_samples[$number_of_samples - 2];
        
//        $price = store::getRobotValue($user_code, $robot_code, 'robot_track_value');
//        $previous_price = store::getRobotValue($user_code, $robot_code, 'robot_track_value', 1);
        $price = null;
        $previous_price = null;
        if (is_null($price) || is_null($previous_price))
        {
            $price = $this->getPrice($sample, $coinpair);
            $previous_price = $this->getPrice($previous_sample, $coinpair);             
        }         
        
        $diff = abs($price - $previous_price);
        
        if ($price >= $previous_price)
        {
            return array(
                'up' => $diff,
                'down' => 0,
            );            
        }
        else
        {
            return array(
                'up' => 0,
                'down' => $diff,
            );
        }
    }
    public function rsi(
                        // Up
                        $previous_up_filter_value,
                        $up_filter_value,
                        $up_value,
                        // Down
                        $previous_down_filter_value,
                        $down_filter_value,
                        $down_value,

                        $periods,
                        $smoothed)
    {
        // Calculate RS
        if ($smoothed && isset($previous_up_filter_value) && isset($previous_down_filter_value))
        {
            $a = (($previous_up_filter_value * ($periods-1)) + $up_value) / $periods;
            $b = (($previous_down_filter_value * ($periods-1)) + $down_value) / $periods;
            if ($a == 0) return 0;
            if ($b == 0) return 100;
            $rs = $a / $b;
        }
        else
        {
            if ($up_filter_value == 0) return 0;
            if ($down_filter_value == 0) return 100;
            $rs = $up_filter_value / $down_filter_value;            
        }
      
        // Calculate RSI
        $rsi = 100 - (100 / (1 + $rs));
        
        return $rsi;
    }
    
    public function obv($previous_obv, $all_samples,  $user, $robot)
    {
        if (!isset($previous_obv))
        {
            $previous_obv = 0;
        }
        
        $total_samples = count($all_samples);
        
        if ($total_samples <= 1)
        {
            return $previous_obv;
        }
        
        $coinpair = $robot['coinpair'];
        $user_code = $user['userdata']['code'];
        $robot_code = $robot['code'];
        
        $sample = $all_samples[$total_samples - 1];
        $volume = $this->getVolume($sample, $coinpair);
        
        $price = store::getRobotValue($user_code, $robot_code, 'robot_track_value');
        $previous_price = store::getRobotValue($user_code, $robot_code, 'robot_track_value', 1);
        if (is_null($price) || is_null($previous_price))
        {
            $price = $this->getPrice($sample, $coinpair);
            $previous_sample = $all_samples[$total_samples - 2];
            $previous_price = $this->getPrice($previous_sample, $coinpair);             
        }            
        
        if ($price > $previous_price)
        {
            $perc_price = ($previous_price * 100) / $price;
            $vol = ($volume * $perc_price) / 100;
//            return $previous_obv + $volume;
            return $previous_obv + $vol;
        }
        elseif ($price < $previous_price)
        {
            $perc_price = ($price * 100) / $previous_price;
            $vol = ($volume * $perc_price) / 100;
//            return $previous_obv - $volume;
            return $previous_obv - $vol;
        }
        else
        {
            return $previous_obv;
        }
    }
}
