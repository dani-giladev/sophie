<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * wildTrainingGroup controller
 *
 * @author Dani Gilabert
 */
class wildTrainingGroup extends controller
{
    public function getAll()
    {
        $view = $this->model->getView("wildTrainingGroup");
        $data = $view->exec();
        return $data;
    }
    
    public function getFiltered($params)
    {
        
        $raw_data = $this->getAll()['data'];

        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $item)
            {
                // Set order
                if (!isset($item['order']))
                {
                    $item['order'] = '100';
                }
              
                // Clean item
                $this->model->clean($item);
                    
                // Add item
                $data[] = $item; 
            }
            
            if (!empty($data))
            {
                $data = helpers::sortArrayByField($data, 'order');
            }
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
        $order = (isset($params['order']) && !empty($params['order']))? $params['order'] : "100";
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
            $id = strtolower('cryptos_wildtraininggroup-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->wildTrainingGroup['the_wildtraininggroup_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
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
        $doc['order'] = $order;
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
