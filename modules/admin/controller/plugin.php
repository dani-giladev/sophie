<?php

namespace modules\admin\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\config;
use base\core\controller\trans;
use base\core\controller\helpers;
use base\core\controller\api;
use wizards\controller\pluginMetacode;
use wizards\controller\maintenanceMetacode;

/**
 * Plugins controller
 *
 * @author Default user
 * @author Default user
 * 
 */
class plugin extends controller 
{
    
    public function getAll()
    {
        $view = $this->model->getView("plugin");
        $raw_data = $view->exec()['data'];

        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $item)
            {
                if (!isset($item['available']))
                {
                    $item['available'] = true;
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
        $name = (isset($params['description']))? $params['description'] : "";

        $maint_code = (isset($params['maint_code']))? $params['maint_code'] : "template";
        $maint_name = (isset($params['maint_name']))? $params['maint_name'] : "template";
        
        // Properties
        $available = (isset($params['available']) && $params['available'] == 'on') ? true : false;
        
        if (isset($params['id']) && !empty($params['id']))
        {
            // Edit
            //$id = strtolower($params['id']); // It doesn't work because app_plugin-BI (uppercase)
            $id = $params['id'];
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
                        $this->trans->mod->plugin['the_plugin_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
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
        $doc['description'] = $name;
        
        // Properties
        $doc['available'] = $available;
        
        // Last modification
        $doc['modified_by_user'] = $this->token->getUserCode();
        $doc['modified_by_user_name'] = $this->token->getUserName();
        $doc['last_modification_date'] = date("Y-m-d H:i");
        
        // Save
        $this->model->save($id, $doc);

        return helpers::resStruct(true, "", array($id));
    }
    
    public function getTrans($plugin = null)
    {
        if(is_null($plugin))
        {
            $res = $this->trans;
        }
        
        $res = new trans(str_replace("app_plugin-", "", $plugin), $this->lang->getLang());
        
        return helpers::resStruct(true, "", $res);
    }
    
    public function getConfig($plugin = null)
    {
        if(is_null($plugin))
        {
            $config = $this->config;
        }
        else
        {
            $config = new config(str_replace("app_plugin-", "", $plugin));
        }
        
        return helpers::resStruct(true, "", $config);
    }
    
    public function getMenu($plugin = null, $user = null)
    {
        $user = (is_null($user)) ? $this->token->getUser()['data'] : $user;
        $plugin_code = str_replace("app_plugin-", "", $plugin);
        if (!$this->exist($plugin_code))
        {
            return helpers::resStruct(false, "");
        }
        
        $config = $this->getConfig($plugin)['data'];
        $trans = $this->getTrans($plugin)['data'];
        
        $menu = $config['mod']['MENU'];
        $menu_translations = $trans['mod']['MENU'];
        if ($plugin_code === 'admin')
        {
            $breadscrumb = '';
        }
        else
        {
            $breadscrumb = isset($menu_translations[$plugin_code])? $menu_translations[$plugin_code] : $config['mod']['NAME'];
        }
        
        $translated_admin_menu = $this->_transMenu($menu['admin'], $menu_translations, $breadscrumb);
        $translated_UI_menu = $this->_transMenu($menu['UI'], $menu_translations, $breadscrumb);

        $translated_menu = array(
            "admin" => $translated_admin_menu,
            "UI"    => $translated_UI_menu
        );
        
        return helpers::resStruct(true, "", $translated_menu);
    }

    protected function _transMenu($menu, $translations, $breadscrumb)
    {
        
        foreach($menu as $key => $values)
        {
            // Label
            if (isset($values['alias']) && isset($translations[$values['alias']]))
            {
                $values['label'] = $translations[$values['alias']];
            }
            else
            {
                $values['label'] = $values['alias'];
            }
            
            // Breadscrumb
            $current_breadscrumb = '';
            if (empty(!$breadscrumb))
            {
                $current_breadscrumb .= $breadscrumb.' > ';
            }
            $current_breadscrumb .= $values['label'];
            $values['breadscrumb'] = $current_breadscrumb;
            
            // Children
            if (isset($values['children']) && !empty($values['children']))
            {
                $values['children'] = $this->_transMenu($values['children'], $translations, $current_breadscrumb);
            }
            
            $menu[$key] = $values;
        }
        
        return $menu;
    }
    
    public function exist($plugin_code)
    {
        $plugin_config_path = __DIR__."/../../".$plugin_code."/config.php";
        if (!file_exists($plugin_config_path))
        {
            return false;
        }
        
        return true;
    }
    
    public function getGrants($plugin_code)
    {
        $data = array();
        
        if ($this->token->isSuperUser())
        {
            $data['is_super_user'] = true;
        }
        else
        {
            $data['is_super_user'] = false;
            $login = $this->token->getUserLogin();
            if (empty($login))
            {
                return helpers::resStruct(true, "", $data);
            }
            $user = api::ask("/admin/user/getByLogin/".$login)['data'];
            if (!isset($user[$plugin_code.'_grants']))
            {
                return helpers::resStruct(true, "", $data);
            }
            $data = array_merge($data, $user[$plugin_code.'_grants']);
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function createModule($params)
    {
        // Get params
        $code = $params['code'];
        $db = ($params['db'] == 'true');
        $dbcommon = ($params['dbcommon'] == 'true');
        
        // Check plugin
        $id = strtolower($this->model->type.'-'.$code);
        $doc = $this->model->get($id)['data'];
        if (empty($doc))
        {
            return helpers::resStruct(false, "Plugin inexistente"); 
        }
        
        // New metacode instance
        $author = $this->token->getUserName();
        $metacode = new pluginMetacode($doc['code'], $doc['description'], $author);

        // Check requirements
        $ret_check = $metacode->checkRequirements();
        if (!$ret_check['success'])
        {
            return helpers::resStruct(false, $ret_check['msg']);
        }
        
        // Create module DB's
        if ($db)
        {
            $dbname = $code;
            if (!$this->model->existDatabase($dbname) && !$this->model->createDatabase($dbname))
            {
                return helpers::resStruct(false, "No se ha podido crear la base de datos: ".$dbname); 
            }
        }
        if ($dbcommon)
        {
            $dbname = $code."-common";
            if (!$this->model->existDatabase($dbname) && !$this->model->createDatabase($dbname))
            {
                return helpers::resStruct(false, "No se ha podido crear la base de datos: ".$dbname); 
            }
        }

        // Try to create metacode
        $metacode->create();

        return helpers::resStruct(true);
    }
    
    public function createMaintenance($params)
    {
        // Get params
        $plugin_code = $params['plugin_code'];
        $code = $params['code'];
        $name_ca = $params['name_ca'];
        $name_es = $params['name_es'];
        $icon = $params['icon'];
        
        // Check plugin
        $id = strtolower($this->model->type.'-'.$plugin_code);
        $doc = $this->model->get($id)['data'];
        if (empty($doc))
        {
            return helpers::resStruct(false, "Plugin inexistente"); 
        }
        
        // New metacode instance
        $author = $this->token->getUserName();
        $metacode = new maintenanceMetacode(
                $doc['code'], 
                array('ca' => $doc['description'], 'es' => $doc['description']), 
                $code, 
                array('ca' => $name_ca, 'es' => $name_es), 
                $icon, 
                $author
        );

        // Check requirements
        $ret_check = $metacode->checkRequirements();
        if (!$ret_check['success'])
        {
            return helpers::resStruct(false, $ret_check['msg']);
        }

        // Try to create metacode
        $metacode->create();

        return helpers::resStruct(true);
    }

    public function getAllMaintenance($params)
    {
        $data = array();
        $module = $params['module'];
        $module_path = __DIR__ . "/../../" . $module . "/UI/view";

        $mants = \scandir(\realpath($module_path));

        foreach ($mants as $value)
        {
            if ($value !== "." && $value !== "..")
            {
                $data[] = array(
                    "code" => $value,
                    "description" => $value
                );
            }
        }

        return helpers::resStruct(true, "", $data);
    }

    public function createField($params)
    {
        $plugin_code = $params['plugin_code'];
        $tabs = json_decode($params['tabs'], true);
        $fields = json_decode($params['fields'], true);

        // Try to create tabs and fields in new maintenance
        $this->createTabs($plugin_code, $tabs);
        $this->createFields($plugin_code, $fields);

    }

    public function createTabs($plugin_code, $tabs)
    {

    }

    public function createFields($plugin_code, $fields)
    {

    }
    
}
