<?php

namespace modules\cryptos\model;

use modules\admin\model\user as adminUser;

/**
 *
 * @author Dani Gilabert
 * 
 */
class user extends adminUser
{
    
    public function __construct()
    {
        parent::__construct();
        
        array_push($this->properties, 
            // Cryptos
            'cryptos_commission',
            'cryptos_commission_coin',
             // Withdrawal
            'cryptos_withdrawal_enabled',
            'cryptos_withdrawal_address',
            'cryptos_withdrawal_coin',
            // Telegram
            'cryptos_telegram_api_id',
            'cryptos_telegram_api_hash',
            'cryptos_telegram_chat_id',
            'cryptos_telegram_bot_token',
            // Pumps
            'cryptos_pumps_amount',
            'cryptos_pumps_amount_unit',
            'cryptos_pumps_buying_perc',
            'cryptos_pumps_stoploss_perc',
//            'cryptos_pumps_megasignal_start_date',
//            'cryptos_pumps_megasignal_start_time',
//            'cryptos_pumps_megasignal_end_date',
//            'cryptos_pumps_megasignal_end_time',
            'cryptos_pumps_megasignal_enabled',
            'cryptos_pumps_binancedex_enabled',
            'cryptos_pumps_min_takeprofit_perc',
            // Settings
            'cryptos_setting_prices_charts' // Array
        );
    }

}