<?php

namespace modules\[MODULE_NAME]\controller;

use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * [MAINTENANCE_NAME] controller
 *
 * @author [AUTHOR]
 */
class [MAINTENANCE_NAME] extends controller
{
    public function getAll()
    {
        $view = $this->model->getView("[MAINTENANCE_NAME]");
        $data = $view->exec();
        return $data;
    }
    
    public function getFiltered($params)
    {
        return $this->getAll();
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
        $notes = (isset($params['notes']))? $params['notes'] : "";

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
            $id = strtolower('[MODULE_NAME]_[MAINTENANCE_NAME]-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->[MAINTENANCE_NAME]['the_[MAINTENANCE_NAME_lowercase]_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
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
        $doc['notes'] = $notes;
        
        // Last modification
        $doc['modified_by_user'] = $this->token->getUserCode();
        $doc['modified_by_user_name'] = $this->token->getUserName();
        $doc['last_modification_date'] = date("Y-m-d H:i");
        
        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }
}
