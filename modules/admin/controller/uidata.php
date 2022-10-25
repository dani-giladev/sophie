<?php

namespace modules\admin\controller;

// Base controllers
use base\core\controller\controller;
use base\core\controller\api;
use base\core\controller\helpers;
use modules\admin\controller\plugin;
use modules\admin\controller\user;

/**
 * Returns main info for admin UI module (languages, translations, app version...)
 *
 * @author Default user
 */
class uidata extends controller
{
    
    public function getUIData()
    {
        if ($this->token->isSuperUser())
        {
            $user_obj = new user();
            $user = $user_obj->getSuperUser();
        }
        else
        {
            $login = $this->token->getUserLogin();

            if (empty($login))
            {
                return helpers::resStruct(false, "Perhaps, you haven't got any valid DEVEL TOKEN assigned...");
            }
            $user = api::ask("/admin/user/getByLogin/".$login)['data'];
            $user['is_super_user'] = false;
        }

       /* $login = "2002";
        $user = api::ask("/admin/user/getByLogin/".$login)['data'];
        $user['is_super_user'] = false;*/

        $data = $this->_buildData($user);

        return helpers::resStruct(true, "", $data);
    }
    
    private function _buildData($user)
    {
        $granted_plugins = $user['granted_plugins'];
        $data = array();
        $data["app_name"] = $this->config->base->NAME;
        $data["app_version"] = $this->config->base->VERSION;
        $data["user_code"] = $user['code'];
        $data["user_name"] = $user['name'];
        $data["cryptos_commission"] = $user['cryptos_commission'];
        $data["cryptos_commission_coin"] = $user['cryptos_commission_coin'];
        $data["is_super_user"] = $user['is_super_user'];
        $data["is_devel"] = $this->config->getBaseDBPARAM("DEVEL");
        $data["modules"] = array();
        $admin_menus = array();
        $plugin_controller = new plugin();
        
        foreach($granted_plugins as $plugin_id)
        {
            $plugin_code = str_replace("app_plugin-", "", $plugin_id);
            
            // Check for plugin existance
            if (!$plugin_controller->exist($plugin_code))
            {
                continue;
            }
            
            $plugin_config_data = api::ask("/admin/plugin/getConfig/".$plugin_id)['data'];
            $plugin_config = $plugin_config_data['mod'];

            // MENUS
            $plugin_menu = $plugin_controller->getMenu($plugin_id, $user)['data'];
            //$plugin_menu = api::ask("/admin/plugin/getMenu/".$plugin_id)['data'];
            $data['menus'][$plugin_code] = $plugin_menu;
            // Add admin menus
            if (!empty($plugin_menu['admin']))
            {
                $admin_menus[$plugin_code] = $plugin_menu['admin'];
            }

            // TRANSLATIONS
            $raw_plugin_translations = api::ask("/admin/plugin/getTrans/".$plugin_id)['data'];
            $data['translations'][$plugin_code] = $raw_plugin_translations['UI'];

            // MODULES
            $plugin_data = api::ask("/admin/plugin/get/".$plugin_id)['data'];
            if (isset($plugin_data['available']) && !$plugin_data['available'])
            {
                continue;
            }
            $plugin_data['icon'] = isset($plugin_config['ICON']) ? $plugin_config['ICON'] : "default";
            $plugin_data['description'] = $raw_plugin_translations['mod']['MENU'][$plugin_code]; // Overriden description
            $plugin_data['order'] = ($plugin_code === 'admin')? 0 : 1;
            $data['modules'][$plugin_code] = $plugin_data;

            // GRANTS
            if(isset($user[$plugin_code.'_grants']))
            {
                $grants = $user[$plugin_code.'_grants'];
                $group_code = (isset($grants['group'])) ? $grants['group'] : null;
                //$group_code = $grants['group'];
                if (!empty($group_code))
                {
                    $group_id = $plugin_code.'_user_group-'.$group_code;
                    $group_data = api::ask("/".$plugin_code."/userGroup/get/".$group_id)['data'];
                    //$grants['group_data'] = $group_data;
                    $grants['grants_by_menu'] = array();
                    
                    if(isset($group_data['grants_by_menu']))
                    {
                        foreach ($group_data['grants_by_menu'] as $value)
                        {
                            $grants['grants_by_menu'][$value['id']] = $value;
                        }
                    }
                    
                    if(isset($group_data['grants_summary']))
                    {
                        $grants['grants_summary'] = $group_data['grants_summary'];
                    }
                    
                    // Special grants
                    if (!isset($grants['special_grants']))
                    {
                        $grants['special_grants'] = array();
                    }
                    if (isset($group_data['special_grants']))
                    {
                        $grants['special_grants'] = array_merge($grants['special_grants'], $group_data['special_grants']);
                    }
                    
                }
                $data['grants'][$plugin_code] = $grants;
            }
            else
            {
                $data['grants'][$plugin_code] = array();
            }
        }
        
        // Add 'admin' module menus to admin module
        if (!empty($data['menus']['admin']) && !empty($admin_menus))
        {
            foreach ($admin_menus as $plugin_code => $menu)
            {
                $menu = array(
                    "alias"     => $plugin_code,
                    "icon"      => $data['modules'][$plugin_code]['icon'],
                    "label"     => $data['modules'][$plugin_code]['description'],
                    "children"  => $menu                    
                );
                $data['menus']['admin']['UI'][] = $menu;
            }
        }

        // Add base translations
        $data['translations']['base'] = $this->trans->base->UI;
        
        // Add admin translations if not exist
        $plugin_code = "admin";
        if (!isset($data['translations'][$plugin_code]))
        {
            $plugin_id = "app_plugin-".$plugin_code;
            $raw_plugin_translations = api::ask("/admin/plugin/getTrans/".$plugin_id)['data'];
            $data['translations'][$plugin_code] = $raw_plugin_translations['UI'];             
        }       
        
        // Sorting modules (in order to paint tabs in order)
        if (!empty($data['modules']))
        {
            $data['modules'] = helpers::sortArrayByMultipleFields($data['modules'], array("order" => "asc", "description" => "asc"));
        }
        
        return $data;
    }
    
}