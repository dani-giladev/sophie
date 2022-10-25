<?php

namespace modules\admin\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\api;
use base\core\controller\helpers;
use modules\admin\controller\user;

/**
 * User group controller
 *
 * @author Default user
 * 
 */
class userGroup extends controller 
{
    
    public function getAll()
    {
        $view = $this->model->getView("userGroup");
        $raw_data = $view->exec()['data'];

        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $item)
            {
                // Special grants
                if (isset($item['special_grants']))
                {
                    foreach ($item['special_grants'] as $key => $value)
                    {
                        $item[$key] = $this->_getSpecialGrantValue($key, $value);
                    }
                    unset($item['special_grants']);
                }
                
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
        $name = (isset($params['name']))? $params['name'] : "";
        
        // Properties
        $available = (isset($params['available']) && $params['available'] == 'on') ? true : false;
        
        // Grants
        $json_grants_by_menu = \html_entity_decode($params['grants_by_menu'], ENT_QUOTES, 'UTF-8');
        $grants_by_menu = \json_decode($json_grants_by_menu);
        $grants_summary = (isset($params['grants_summary']))? $params['grants_summary'] : "";     
        
        if (isset($params['id']) && !empty($params['id']))
        {
            // Edit
            $id = strtolower($params['id']);
            $doc = $this->model->get($id)['data'];
        }
        else
        {
            // New
            $id = strtolower($this->model->type.'-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->userGroup['the_user_group_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            
            $doc = array();
            $doc['code'] = $code;
            // Creation
            $doc['created_by_user'] = $this->token->getUserCode();
            $doc['created_by_user_name'] = $this->token->getUserName();
            $doc['creation_date'] = date("Y-m-d H:i");
        }
        
        // Main
        $doc['name'] = $name;
        
        // Properties
        $doc['available'] = $available;
        
        // Grants
        $doc['grants_by_menu'] = $grants_by_menu;
        $doc['grants_summary'] = $grants_summary;
        
        // Last modification
        $doc['modified_by_user'] = $this->token->getUserCode();
        $doc['modified_by_user_name'] = $this->token->getUserName();
        $doc['last_modification_date'] = date("Y-m-d H:i");
        
        // Special grants
        $this->_setSpecialGrants($params, $doc);
        
        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }
    
    // Overriden method
    protected function _setSpecialGrants($params, &$doc)
    {
        $doc['special_grants'] = array();  
    }
    
    // Overriden method
    protected function _getSpecialGrantValue($key, $value)
    {
        return $value;
    }
    
    public function getGrantsByMenu($params)
    {
        //return helpers::resStruct(false, 'Fuck you', null);
        $module_id = (isset($params['module_id']))? $params['module_id'] : "";
        $id = (isset($params['user_group_id']))? strtolower($params['user_group_id']) : "";
        
        if (isset($id) && !empty($id))
        {
            // Edit
            $doc = $this->model->get($id)['data'];
        }
        else
        {
            // New
            $doc = array();
        }
        
        $plugins = array();
        if ($module_id === 'admin')
        {
            if ($this->token->isSuperUser())
            {
                $user_obj = new user();
                $user = $user_obj->getSuperUser();
                
            }
            else
            {
                $login = $this->token->getUserLogin();
                $user = api::ask("/admin/user/getByLogin/".$login)['data'];                
            }
            foreach($user['granted_plugins'] as $value)
            {
                array_push($plugins, str_replace("app_plugin-", "", $value));
            }
        }
        else
        {
            $plugins = array($module_id);
        }
        
        $data = array();
        foreach ($plugins as $plugin_id)
        {
            $plugin_menu = api::ask("/admin/plugin/getMenu/".$plugin_id);
            if (!isset($plugin_menu) || !$plugin_menu['success'])
            {
                continue;
            }
            $plugin_config[$plugin_id] = api::ask("/admin/plugin/getConfig/".$plugin_id)['data']['mod'];
            if ($module_id !== 'admin' || $plugin_id === 'admin')
            {
                $tree_menu = $plugin_menu['data']['UI'];
            }
            else
            {
                $tree_menu = $plugin_menu['data']['admin'];
            }

            // We don't want to set reporting grants here, so remove reporting menus
            $res = array();
            foreach($tree_menu as $key => $item)
            {
                if($item['alias'] !== "reporting")
                {
                    $res[] = $item;
                }
            }

            $menus = $this->_getMenus($res);
            
            foreach ($menus as $value)
            {
                $item = array();
                $item['id'] = $value['alias'];
                $item['menu_text'] =  $value['label'];
                if ($module_id === 'admin')
                {
                    $item['menu_text'] .= ' ('.$plugin_config[$plugin_id]['NAME'].')';
                }
                
                $permission_denied = true;
                if (!empty($doc) && isset($doc['grants_by_menu']))
                {                
                    foreach ($doc['grants_by_menu'] as $grants_values)
                    {
                        if ($value['alias'] == $grants_values['id'])
                        {
                            $item['visualize'] = (isset($grants_values['visualize']))? $grants_values['visualize'] : false;
                            $item['insert'] = (isset($grants_values['insert']))? $grants_values['insert'] : false;
                            $item['update'] = (isset($grants_values['update']))? $grants_values['update'] : false;
                            $item['remove'] = (isset($grants_values['remove']))? $grants_values['remove'] : false;
                            $permission_denied = false;
                            break;
                        }
                    }
                }

                if ($permission_denied)
                {                
                    $item['visualize'] = false;
                    $item['insert'] = false;
                    $item['update'] = false;
                    $item['remove'] = false;
                }

                $data[] = $item;
            }            
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    private function _getMenus($tree)
    {
        $ret = array();
                
        foreach ($tree as $item)
        {
            if (isset($item['children']) && !empty($item['children']))
            {
                $retaux = $this->_getMenus($item['children']);
                if (!empty($retaux))
                {
                    $ret = array_merge($ret, $retaux);
                }
            }
            else
            {
                $ret[] = $item;
            }
        }
        
        return $ret;
    }

}
