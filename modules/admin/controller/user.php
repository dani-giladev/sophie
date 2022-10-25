<?php

namespace modules\admin\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\helpers;
use base\core\controller\api;

/**
 * User controller
 *
 * @author Default user
 * @author Default user
 * 
 */
class user extends controller 
{
    
    public function getAll()
    {
        $view = $this->model->getView("userbylogin");
        $raw_data = $view->exec()['data'];

        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $item)
            {
                // Admin grants
                $item['admin_grants_group'] = (isset($item['admin_grants']['group']))? $item['admin_grants']['group'] : '';

                // Cryptos grants
                $item['cryptos_grants_group'] = (isset($item['cryptos_grants']['group']))? $item['cryptos_grants']['group'] : '';

// [WIZARD_MODULE_TAG_USER_GETALL]

                // Clean item
                $this->model->clean($item);
                
                // Add item
                $data[] = $item; 
            }     
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function save($params)
    {
//        return helpers::resStruct(false, 'Fuck you', null);
        
        // Main
        $code = (isset($params['code']))? $params['code'] : "";
        $login = (isset($params['login']))? $params['login'] : "";
        $pass = (isset($params['pass']))? $params['pass'] : "";
        $name = (isset($params['name']))? $params['name'] : "";
        // Properties
        $active = (isset($params['active']))? ($params['active'] == 'on') : null;
        $email = (isset($params['email']))? $params['email'] : null;
        $phone = (isset($params['phone']))? $params['phone'] : null;
        $telegram_user = (isset($params['telegram_user']))? $params['telegram_user'] : null;
        $module_id = (isset($params['module_id']))? $params['module_id'] : null;
        // Grants
        $granted_plugins = (isset($params['granted_plugins']))? preg_split("/,/", $params['granted_plugins']) : null;
        // Admin grants
        $admin_rendered_form = (isset($params['admin_rendered_form']))? ($params['admin_rendered_form'] == 'true') : null;
        $admin_grants_group = (isset($params['admin_grants_group']))? $params['admin_grants_group'] : null;
        // Cryptos grants
        $cryptos_rendered_form = (isset($params['cryptos_rendered_form']))? ($params['cryptos_rendered_form'] == 'true') : null;
        $cryptos_grants_group = (isset($params['cryptos_grants_group']))? $params['cryptos_grants_group'] : null;
        // Cryptos 
        $cryptos_commission = (isset($params['cryptos_commission']))? $params['cryptos_commission'] : 0;
        $cryptos_commission_coin = (isset($params['cryptos_commission_coin']))? $params['cryptos_commission_coin'] : "";
        // Withdrawal
        $cryptos_withdrawal_enabled = (isset($params['cryptos_withdrawal_enabled']) && ($params['cryptos_withdrawal_enabled'] == 'on' || $params['cryptos_withdrawal_enabled'] == 'true'));
        $cryptos_withdrawal_address = (isset($params['cryptos_withdrawal_address']))? $params['cryptos_withdrawal_address'] : null;
        $cryptos_withdrawal_coin = (isset($params['cryptos_withdrawal_coin']))? $params['cryptos_withdrawal_coin'] : null;
        // Telegram
        $cryptos_telegram_api_id = (isset($params['cryptos_telegram_api_id']))? $params['cryptos_telegram_api_id'] : null;
        $cryptos_telegram_api_hash = (isset($params['cryptos_telegram_api_hash']))? $params['cryptos_telegram_api_hash'] : null;
        $cryptos_telegram_chat_id = (isset($params['cryptos_telegram_chat_id']))? $params['cryptos_telegram_chat_id'] : null;
        $cryptos_telegram_bot_token = (isset($params['cryptos_telegram_bot_token']))? $params['cryptos_telegram_bot_token'] : null;
        // Pumps
        $cryptos_pumps_amount = (isset($params['cryptos_pumps_amount']))? $params['cryptos_pumps_amount'] : 0;
        $cryptos_pumps_amount_unit = (isset($params['cryptos_pumps_amount_unit']))? $params['cryptos_pumps_amount_unit'] : 'coin';
        $cryptos_pumps_buying_perc = (isset($params['cryptos_pumps_buying_perc']))? $params['cryptos_pumps_buying_perc'] : 1.5;
        $cryptos_pumps_stoploss_perc = (isset($params['cryptos_pumps_stoploss_perc']))? $params['cryptos_pumps_stoploss_perc'] : 5;
//        $cryptos_pumps_megasignal_start_date = (isset($params['cryptos_pumps_megasignal_start_date']))? $params['cryptos_pumps_megasignal_start_date'] : '';
//        $cryptos_pumps_megasignal_start_time = (isset($params['cryptos_pumps_megasignal_start_time']))? $params['cryptos_pumps_megasignal_start_time'] : '';
//        $cryptos_pumps_megasignal_end_date = (isset($params['cryptos_pumps_megasignal_end_date']))? $params['cryptos_pumps_megasignal_end_date'] : '';
//        $cryptos_pumps_megasignal_end_time = (isset($params['cryptos_pumps_megasignal_end_time']))? $params['cryptos_pumps_megasignal_end_time'] : '';
        $cryptos_pumps_megasignal_enabled = (isset($params['cryptos_pumps_megasignal_enabled']) && ($params['cryptos_pumps_megasignal_enabled'] == 'on' || $params['cryptos_pumps_megasignal_enabled'] == 'true'));
        $cryptos_pumps_binancedex_enabled = (isset($params['cryptos_pumps_binancedex_enabled']) && ($params['cryptos_pumps_binancedex_enabled'] == 'on' || $params['cryptos_pumps_binancedex_enabled'] == 'true'));
        $cryptos_pumps_min_takeprofit_perc = (isset($params['cryptos_pumps_min_takeprofit_perc']))? $params['cryptos_pumps_min_takeprofit_perc'] : 2;
        
// [WIZARD_MODULE_TAG_USER_SAVE]

        if (isset($params['id']) && !empty($params['id']))
        {
            // Edit
            $id = strtolower($params['id']);
            $doc = $this->model->get($id)['data'];
            if ($doc['login'] != $login && $this->existsLogin($login))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->user['the_user_with_login']." '<b>".$login."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            
            if (!empty($pass) && $doc['pass'] != $pass)
            {
                $doc['pass'] = md5($pass);
            }
        }
        else
        {
            // New
            $id = strtolower($this->model->type.'-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->user['the_user_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            if ($this->existsLogin($login))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->user['the_user_with_login']." '<b>".$login."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            
            $doc = array();
            $doc['code'] = $code;
            $doc['pass'] = (!empty($pass))? md5($pass) : md5('mariposil');
            // Creation
            $doc['created_by_user'] = $this->token->getUserCode();
            $doc['created_by_user_name'] = $this->token->getUserName();
            $doc['creation_date'] = date("Y-m-d H:i");
            
            if (isset($module_id))
            {
                $active = true;
                $granted_plugins = array('app_plugin-'.$module_id);
            }
        }
        
        // Main
        $doc['login'] = $login;
        $doc['name'] = $name;
        
        // Properties
        if (!is_null($active))
        {
            $doc['active'] = $active;
        }
        if (!is_null($email))
        {
            $doc['email'] = $email;
        }
        if (!is_null($phone))
        {
            $doc['phone'] = $phone;
        }
        if (!is_null($telegram_user))
        {
            $doc['telegram_user'] = $telegram_user;
        }
        
        // Grants
        if (!is_null($granted_plugins))
        {
            $doc['granted_plugins'] = $granted_plugins;
        }
        // Admin grants
        if ($admin_rendered_form)
        {
            $doc['admin_grants']['group'] = $admin_grants_group;
        }
        // Cryptos grants
        if ($cryptos_rendered_form)
        {
            $doc['cryptos_grants']['group'] = $cryptos_grants_group;
            // General
            $doc['cryptos_commission'] = $cryptos_commission;
            $doc['cryptos_commission_coin'] = $cryptos_commission_coin;
            // Withdrawal
            $doc['cryptos_withdrawal_enabled'] = $cryptos_withdrawal_enabled;
            $doc['cryptos_withdrawal_address'] = $cryptos_withdrawal_address;
            $doc['cryptos_withdrawal_coin'] = $cryptos_withdrawal_coin;
            // Telegram
            $doc['cryptos_telegram_api_id'] = $cryptos_telegram_api_id;
            $doc['cryptos_telegram_api_hash'] = $cryptos_telegram_api_hash;
            $doc['cryptos_telegram_chat_id'] = $cryptos_telegram_chat_id;
            $doc['cryptos_telegram_bot_token'] = $cryptos_telegram_bot_token;
            // Pumps
            $doc['cryptos_pumps_amount'] = $cryptos_pumps_amount;
            $doc['cryptos_pumps_amount_unit'] = $cryptos_pumps_amount_unit;
            $doc['cryptos_pumps_buying_perc'] = $cryptos_pumps_buying_perc;
            $doc['cryptos_pumps_stoploss_perc'] = $cryptos_pumps_stoploss_perc;
//            $doc['cryptos_pumps_megasignal_start_date'] = $cryptos_pumps_megasignal_start_date;
//            $doc['cryptos_pumps_megasignal_start_time'] = $cryptos_pumps_megasignal_start_time;
//            $doc['cryptos_pumps_megasignal_end_date'] = $cryptos_pumps_megasignal_end_date;
//            $doc['cryptos_pumps_megasignal_end_time'] = $cryptos_pumps_megasignal_end_time;
            $doc['cryptos_pumps_megasignal_enabled'] = $cryptos_pumps_megasignal_enabled;
            $doc['cryptos_pumps_binancedex_enabled'] = $cryptos_pumps_binancedex_enabled;
            $doc['cryptos_pumps_min_takeprofit_perc'] = $cryptos_pumps_min_takeprofit_perc;
        }
// [WIZARD_MODULE_TAG_USER_SAVE_VAR]

        // Last modification
        $doc['modified_by_user'] = $this->token->getUserCode();
        $doc['modified_by_user_name'] = $this->token->getUserName();
        $doc['last_modification_date'] = date("Y-m-d H:i");

        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }
    
    public function existsLogin($login)
    {
        $data = $this->getByLogin($login);
        return ($data['success']);
    }
    
    // Return array
    public function getByLogin($login)
    {
        $view = $this->model->getView("userbylogin");
        $view->setKey($login);
        $user = $view->exec();
        
        if ($user['success'] && (isset($user['data'][0])))
        {
            return helpers::resStruct(true, "", $user['data'][0]);
        }
        else
        {
            return helpers::resStruct(false, "", array());
        }
    }
    
    public function getByCode($code)
    {
        $view = $this->model->getView("userbycode");
        $view->setKey($code);
        $user = $view->exec();
        
        if ($user['success'] && (isset($user['data'][0])))
        {
            return helpers::resStruct(true, "", $user['data'][0]);
        }
        else
        {
            return helpers::resStruct(false, "", array());
        }
    }
    
    public function isSuperUser($login, $pass)
    {
        $config = $this->config->base->SUPER_USER;
        return ($config['login'] === $login && $config['pass'] === $pass);
    }
    
    public function getSuperUser()
    {
        $config = $this->config->base->SUPER_USER;
        $all_plugins = api::ask("/admin/plugin/getAll")['data'];
        
        if (empty($all_plugins))
        {
            $params = array(
                'code' => 'admin',
                'description' => 'Administration',
                'available' => 'on'
            );
            $plugin_ret = api::ask("/admin/plugin/save", $params, "POST");
            $all_plugins = api::ask("/admin/plugin/getAll")['data'];
        }
        
        $granted_plugins = array();
        foreach ($all_plugins as $value)
        {
            array_push($granted_plugins, $value['_id']);
        }
        
        return array(
            'code' => $config['login'],
            'login' => $config['login'],
            'pass' => $config['pass'],
            'name' => 'SUPER USER',
            'is_super_user' => true,
            'active' => true,
            'granted_plugins' => $granted_plugins
        );        
    }
    
    // Return array
    public function validate($params)
    {
        $encodedpass = (isset($params['encodedpass']))? $params['encodedpass'] : md5($params['pass']);
                
        // Is super user?
        if ($this->isSuperUser($params['login'], $encodedpass))
        {
            $user = $this->getSuperUser();
        }
        else
        {
            $raw_user = $this->getByLogin($params['login']);
            if(!$raw_user['success'])
            {
                return helpers::resStruct(false, $this->trans->mod->user['invalid_user_or_password']);
            }
            $user = $raw_user['data'];
            $user['is_super_user'] = false;
        }
        
        if ((isset($user['active']) && (boolean) !$user['active']) || !isset($user['active']))
        {
            return helpers::resStruct(false, $this->trans->mod->user['the_user_with_login']." '".$user['login']."' ".$this->trans->mod->user['is_not_activated']);
        }
        
        if ($encodedpass != $user['pass'])
        {
            return helpers::resStruct(false, $this->trans->mod->user['invalid_user_or_password']);
        }
        
        // Save token in permitted tokens list
        $token = $this->token->add($user, $params['lang']);
        return helpers::resStruct(true, "", array("token" => $token));        
    }
    
    public function logout($params)
    {
        $token = (isset($params['token'])) ? $params['token'] : $this->token->getToken();
        
        // Delete token
        $this->token->remove($token);
        
        return helpers::resStruct(true, "");  
    }
}
