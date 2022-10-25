<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * historyRobotChanges controller
 *
 * @author Dani Gilabert
 */
class historyRobotChanges extends controller
{
    
    public function getFiltered($params)
    {
        $user_code = (isset($params['user_code']))? $params['user_code'] : null;
        $robot_code = (isset($params['robot_code']))? $params['robot_code'] : null;
        $start_date = (isset($params['start_date']))? $params['start_date'] : null;
        $end_date = (isset($params['end_date']))? $params['end_date'] : null;
        
        if (is_null($start_date))
        {
            $start_date = "1970-01-01";
        }        
        if (is_null($end_date))
        {
            $end_date = "2999-31-12";
        }
        
        if (isset($user_code) && isset($robot_code))
        {
            $view = $this->model->getView("historyRobotChangesByUserAndRobotAndDate");
            $view->setStartKey(array($user_code, $robot_code, $start_date));
            $view->setEndKey(array($user_code, $robot_code, $end_date));              
        }
        else
        {
            $view = $this->model->getView("historyRobotChangesByDate");
            $view->setStartKey(array($start_date));
            $view->setEndKey(array($end_date));  
        }
        
        $raw_data = $view->exec()['data'];

        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $robot)
            {
                if (isset($user_code) && $user_code !== $robot['created_by_user'] && $user_code !== 'allusers')
                {
                    continue;
                }
                
                // Grouping
                $robot['history_robot_changes_grouping'] = $robot['created_by_user_name'];
              
                // Clean item
                $this->model->clean($robot);
                    
                // Add item
                $data[] = $robot; 
            }
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function save($doc)
    {
        $user_code = $doc['created_by_user'];
        $robot_code = $doc['code'];
        $date = date('Y-m-d');
        
        unset($doc['_id']);
        $this->model->clean($doc);
        
        $id = strtolower('cryptos_historyrobotchanges-'.$user_code.'-'.$robot_code.'-'.$date);
        if ($this->model->exist($id))
        {
            $last_doc = $this->model->get($id)['data'];
            $doc['_id'] = $last_doc['_id'];
            $doc['_rev'] = $last_doc['_rev'];
        }
            
        $doc['date'] = $date;
        
        // Save
        $ret = $this->model->save($id, $doc);
    }
}
