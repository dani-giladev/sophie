<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\training;
use modules\cryptos\controller\robot;

/**
 * Wild training controller
 *
 * @author Dani Gilabert
 */
class wildTraining extends training
{
    
    protected function _addSpecificProperties(&$doc)
    {
        $doc['original_robot'] = array();
        $doc['original_robot_total_profit_usdt'] = "";
        $doc['original_robot_total_profit_perc'] = "";
        $doc['original_robot_transactions'] = "";
        $doc['original_robot_trades'] = "";
        $doc['original_robot_hits'] = "";
        $doc['original_robot_hits_perc'] = "";
        $doc['original_robot_total_time'] = 0;   
        
        $doc['bcr'] = array();
        $doc['bcr_total_profit_usdt'] = "";
        $doc['bcr_total_profit_perc'] = "";
        $doc['bcr_transactions'] = "";
        $doc['bcr_trades'] = "";
        $doc['bcr_hits'] = "";
        $doc['bcr_hits_perc'] = "";
        $doc['bcr_total_time'] = 0;      
        $doc['bcr_training_number'] = "";
        
        $doc['final_total_time'] = 0;
        $doc['validated'] = false;
        $doc['winner'] = '';
        $doc['max_time'] = 0;
    }
    
    protected function _getViewName() {
        return "wildTrainings";
    }   
    
    public function getPendingTrainingsToValidate($user_code)
    {
        $view_name = $this->_getViewName();
        $view = $this->model->getView($view_name."ByUserAndFinalizedAndValidated");
        $view->setStartKey(array($user_code, true, false));
        $view->setEndKey(array($user_code, true, false));          
        return $view->exec()['data'];
    }
    
    public function updateTheWinner($params)
    {
        if (!isset($params['training_code']))
        {
            return helpers::resStruct(true, "Fuck you!");
        }
        
        $winner = $params['winner'];
        $user_code = (isset($params['user_code']))? $params['user_code'] : $this->token->getUserCode();
        
        $winner_robot_ret = $this->getTrainingRobot($params);
        if (!$winner_robot_ret['success'])
        {
            return helpers::resStruct(false, $winner_robot_ret['msg']);
        }
        
        // Get training
        $training_code = $params['training_code'];
        $id = $this->normalizeId($this->model->type.'-'.$training_code);
        $doc = $this->get($id)['data'];
        
        $original_robot = $doc['original_robot'];
        if ($user_code !== $original_robot['created_by_user'])
        {
            return helpers::resStruct(false, "Fuck you! You are not the owner of this robot!!");
        }
        
        // Update training
        $doc['finalized'] = true;   
        $doc['validated'] = true;
        $doc['winner'] = $winner;
        // Save
        $ret_save_training = $this->model->save($id, $doc);
        if (!$ret_save_training['success'])
        {
            return helpers::resStruct(false, 'Error updating training: '.$ret_save_training['msg']);
        }
        
        if ($winner !== 'original')
        {
            // Update robot
            $winner_robot = $winner_robot_ret['data'];
            $robot_controller = new robot();
            $winner_robot['id'] = $winner_robot['_id'];
            $winner_robot['last_modification_comesfrom_training'] = true;
            $winner_robot['last_training_code'] = $training_code;
            $winner_robot['last_training_was_wild'] = true;
            $winner_robot['last_training_winner'] = $winner;         
            $ret_save_robot = $robot_controller->save($winner_robot);
            if (!$ret_save_robot['success'])
            {
                return helpers::resStruct(false, 'Error updating robot: '.$ret_save_robot['msg']);
            }            
        }
        
        return helpers::resStruct(true);
    }
    
    public function automaticWinnerUpdate($params)
    {
        if (!isset($params['training_code']))
        {
            return helpers::resStruct(true, "Fuck you!");
        }
        
        $user_code = (isset($params['user_code']))? $params['user_code'] : $this->token->getUserCode();
        
        // Get training
        $training_code = $params['training_code'];
        $id = $this->normalizeId($this->model->type.'-'.$training_code);
        $training = $this->get($id)['data'];
        
        $original_robot = $training['original_robot'];
        if ($user_code !== $original_robot['created_by_user'])
        {
            return helpers::resStruct(false, "Fuck you! You are not the owner of this robot!!");
        }
        
        // Select the winner
        $winner = 'original';
        if (isset($training['bcr']) && !empty($training['bcr']) && $training['bcr_training_number'] != 0 && $training['bcr_hits'] > 0)
        {
            $winner = 'bcr';
        }
        elseif (isset($training['robot']) && !empty($training['robot']) && $training['training_number'] != 0 && $training['hits'] > 0)
        {
            $winner = 'robot';
        }
        
        return $this->updateTheWinner(array(
            'training_code' => $training_code,
            'winner' => $winner,
            'user_code' => $user_code
        ));
    }
    
}
