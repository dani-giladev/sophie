<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\helpers;
use modules\cryptos\controller\user;
use modules\cryptos\controller\robot;
use base\core\controller\timer;
use modules\cryptos\controller\sampleTraining;
use modules\cryptos\controller\transactionTraining;
// Robot
use modules\cryptos\robot\training as robotTraining;
use modules\cryptos\robot\user as robotUser;

/**
 * training controller
 *
 * @author Dani Gilabert
 */
class training extends controller
{
    protected $_codes = array();
    
    public function getFiltered($params)
    {        
        $user_code = (isset($params['user_code']))? $params['user_code'] : null;
        $robot_code = (isset($params['robot_code']))? $params['robot_code'] : null;
        $start_date = (isset($params['start_date']))? ($params['start_date'].' 00:00') : null;
        $end_date = (isset($params['end_date']))? ($params['end_date'].' 23:59') : null;
        $finalized = (isset($params['finalized']))? $params['finalized'] : null;
        $validated = (isset($params['validated']))? $params['validated'] : null;
        
        $trainings = $this->getTrainings($user_code, $robot_code, $start_date, $end_date, 'DESC');
        
        $data = array();
        foreach ($trainings as $training)
        {
            if (!is_null($finalized) && $training['finalized'] !== $finalized)
            {
                continue;
            }
            
            if (!is_null($validated) && $training['validated'] !== $validated)
            {
                continue;
            }
                
            // Grouping
            $training['training_grouping'] = $training['user_name'];
            
            // Set some dynamic properties
            $training['candlestick_interval'] = $training['robot']['candlestick_interval'];
            
            $this->model->clean($training);
            
            $data[] = $training;
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    protected function _getViewName() {
        return "trainings";
    }
    
    public function getTrainings($user_code, $robot_code, $start_date, $end_date, $order = 'ASC')
    {
        $view_name = $this->_getViewName();
        
        if (isset($user_code) && isset($robot_code) && isset($start_date) && isset($end_date))
        {
            $view = $this->model->getView($view_name."ByUserAndRobotAndDate");
            $view->setStartKey(array($user_code, $robot_code, $start_date));
            $view->setEndKey(array($user_code, $robot_code, $end_date));              
        }
        elseif ((!isset($user_code) || !isset($robot_code)) && isset($start_date) && isset($end_date))
        {
            $view = $this->model->getView($view_name."ByDate");
            $view->setStartKey(array($start_date));
            $view->setEndKey(array($end_date)); 
        }
        elseif (isset($user_code) && isset($robot_code) && (!isset($start_date) || !isset($end_date)))
        {
            $view = $this->model->getView($view_name."ByUserAndRobot");
            $view->setStartKey(array($user_code, $robot_code));
            $view->setEndKey(array($user_code, $robot_code));               
        } 
        else
        {
            $view = $this->model->getView($view_name."ByUserAndRobot");
        }

        $data = $view->exec()['data'];
        
        if (!empty($data) && $order == 'DESC')
        {
            $data = helpers::sortArrayByField($data, 'creation_date', SORT_DESC);
        }

        return $data;
    }   
    
    public function getTrainingsInProgress($user_code, $robot_code)
    {
        $view_name = $this->_getViewName();
        $view = $this->model->getView($view_name."ByUserAndRobotAndFinalized");
        $view->setStartKey(array($user_code, $robot_code, false));
        $view->setEndKey(array($user_code, $robot_code, false));          
        return $view->exec()['data'];
    }
    
    public function save($params)
    {
        // Add sample
        $code = $this->_getNewCode();
        $id = $this->normalizeId($this->model->type.'-'.$code);   

        // Main
        $doc = array();
        $doc['code'] = $code;
        
        // User
        $doc['user_code'] = $params['user_code'];
        $user_controller = new user();
        $user_id = $user_controller->normalizeId($user_controller->model->type.'-'.$doc['user_code']);
        $user_doc = $user_controller->model->get($user_id)['data'];
        $doc['user_name'] = $user_doc['name'];
        
        // Robot
        $doc['robot_code'] = $params['robot_code'];
        $robot_controller = new robot();
        $robot_id = $robot_controller->normalizeId($robot_controller->model->type.'-'.$doc['user_code'].'-'.$doc['robot_code']);
        $robot_doc = $robot_controller->model->get($robot_id)['data'];
        $doc['robot_name'] = $robot_doc['name'];
        $doc['coinpair'] = $robot_doc['coinpair'];
        $doc['coinpair_name'] = $robot_doc['coinpair_name'];
        
        // Training
        $doc['finalized'] = false;
        $doc['period'] = $params['period'];
        $doc['start_date'] = $params['start_date'];
        $doc['end_date'] = $params['end_date'];
        $doc['record_samples'] = (isset($params['record_samples'])? $params['record_samples'] : false);
        
        // Result
        $doc['error_msg'] = "";
        $doc['current_sample_date'] = "";
        $doc['number_of_trainings'] = 1;
        $doc['training_number'] = 1;
        
        $doc['robot'] = $robot_doc;
        $doc['total_profit_usdt'] = "";
        $doc['total_profit_perc'] = "";
        $doc['transactions'] = "";
        $doc['trades'] = "";
        $doc['hits'] = "";
        $doc['hits_perc'] = "";
        $doc['total_time'] = 0;
        
        $this->_addSpecificProperties($doc);

        // Creation
        $doc['created_by_user'] = (isset($params['created_by_user'])? $params['created_by_user'] : $this->token->getUserCode());
        $doc['created_by_user_name'] = (isset($params['created_by_user_name'])? $params['created_by_user_name'] : $this->token->getUserName());
        $doc['creation_date'] = date("Y-m-d H:i"); 

        // Save
        $this->model->save($id, $doc);
                
        return helpers::resStruct(true, "", array(
            'training_code' => $code
        ));
    }
    
    protected function _addSpecificProperties(&$doc)
    {
        
    }
    
    protected function _getNewCode()
    {
        //return date("YmdHis")."-".rand(100, 999);
        do {
            $t = microtime(true);
            //$micro = sprintf("%06d",($t - floor($t)) * 1000000);
            $micro = str_replace(".", "", $t);
            $code = date("YmdHis")."-".$micro;
            if (in_array($code, $this->_codes))
            {
                usleep(0.5 * 1000 * 1000);
                continue;
            }
            array_push($this->_codes, $code);
            return $code;
        } while (true);
    }
    
    public function toggleProgressStatus($params)
    {
        if (!isset($params['training_code']))
        {
            return helpers::resStruct(true, "Fuck you!");
        }
        
        // Get training
        $training_code = $params['training_code'];
        $id = $this->normalizeId($this->model->type.'-'.$training_code);
        $doc = $this->get($id)['data'];
        
        // Save
        $doc['finalized'] = !$doc['finalized'];   
        $this->model->save($id, $doc);
        
        return helpers::resStruct(true);
    }
    
    public function getTrainingRobot($params)
    {
        if (!isset($params['training_code']))
        {
            return helpers::resStruct(true, "Fuck you!");
        }
        
        $winner = $params['winner'];
        
        // Get training
        $training_code = $params['training_code'];
        $id = $this->normalizeId($this->model->type.'-'.$training_code);
        $doc = $this->get($id)['data'];
        
        // Get robot
        if ($winner === 'original')
        {
            if (!isset($doc['original_robot']))
            {
                return helpers::resStruct(false, "The original robot hasn't been registered!");
            }
            $robot = $doc['original_robot'];
        }
        elseif ($winner === 'bcr')
        {
            if (!isset($doc['bcr']))
            {
                return helpers::resStruct(false, "The best custom robot hasn't been registered!");
            }
            $robot = $doc['bcr'];
        }
        else
        {
            $robot = $doc['robot'];
        }
        
        return helpers::resStruct(true, "", $robot);
    }    
    
    public function train($training_code)
    {
        // Check if training exist
        $training_id = $this->normalizeId($this->model->type.'-'.$training_code);
        $training = $this->get($training_id)['data'];
        if (empty($training))
        {
            return helpers::resStruct(false, "The training $training_code doesn't exist");
        }
        
        $user_code = $training['user_code'];
        $robot_code = $training['robot_code'];

        // Init controllers
        $sample_training_controller = new sampleTraining();
        $transaction_training_controller = new transactionTraining();
        $user_controller = new robotUser();
        
        // Get the user doc
        $user_doc = $user_controller->getUserDoc($user_code);
        if (empty($user_doc))
        {
            return $this->_updateErrorMsg($training_id, "User doesn't exist");
        }
        
        // Get robot
        $robot_controller = new robot();
        $robot_id = $robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot_doc = $robot_controller->get($robot_id)['data'];
        if (empty($robot_doc))
        {
            return $this->_updateErrorMsg($training_id, "Robot doesn't exist");
        }
        
        // Set robot properties
        $candlestick_interval = $robot_controller->getValue($robot_doc, 'candlestick_interval');
        
        // Delete all training transactions
        $training_history = $transaction_training_controller->getTransactions($user_code, $robot_code, null, null);
        foreach ($training_history as $transaction)
        {
            $del_ret = $transaction_training_controller->model->delete($transaction['_id']);
        }
        // Delete all training samples
        $training_samples = $sample_training_controller->getSamplesByUserAndRobotAndIntervalAndDate($user_code, $robot_code, $candlestick_interval, "1900-01-01", "2999-12-31");
        foreach ($training_samples as $sample)
        {
            $del_ret = $sample_training_controller->model->delete($sample['_id']);
        }
        
        // Get the user with robots
        $user = $user_controller->getUser($user_doc, $candlestick_interval);
        if (empty($user))
        {
            return $this->_updateErrorMsg($training_id, "User doesn't have available robots");
        }
        
        // Get the robot
        if (!isset($user['robots'][$robot_code]))
        {
            return $this->_updateErrorMsg($training_id, "Robot doesn't exist");
        }
        $robot = $user['robots'][$robot_code];
        // Add rev to update after
        $robot['_rev'] = $robot_doc['_rev'];
        
        // Starting training...
        $robot_training_controller = new robotTraining();
        $robot_training_controller->init(array(
            'user' => $user,
            'robot' => $robot,
            'start_date' => $training['start_date'],
            'end_date' => $training['end_date'],
            'record_samples' => $training['record_samples'],
            'training_code' => $training_code,
            'wild' => false
        ));
        // Set max filter factor value
        $robot_training_controller->setMaxFilterFactor();
        // Set samples
        $robot_training_controller->setSmpls();
        // Check requirements
        $ret_check_req = $robot_training_controller->checkRequirements();
        if (!$ret_check_req['success'])
        {
            return $this->_updateErrorMsg($training_id, $ret_check_req['msg']);
        }
        
        // Finally, Train!
        $timer = new timer();
        $ret = $robot_training_controller->train();
        $total_time = $timer->getTotalTime();
        
        // Happy end!
        $data = $ret['data'];
        $doc = $this->get($training_id)['data'];
        $doc['finalized'] = true;
        $doc['error_msg'] = "";
        $doc['total_profit_usdt'] = $data['total_profit_usdt'];
        $doc['total_profit_perc'] = $data['total_profit_perc'];
        $doc['transactions'] = $data['transactions'];
        $doc['trades'] = $data['trades'];
        $doc['hits'] = $data['hits'];
        $doc['hits_perc'] = $data['hits_perc'];
        // Async
        $doc['is_asynchronous'] = $data['is_asynchronous'];
        $doc['async_transactions'] = $data['async_transactions'];
        $doc['async_total_profit_usdt'] = $data['async_total_profit_usdt'];
        $doc['total_time'] = $total_time;
        $save_ret = $this->model->save($training_id, $doc);
        
        return helpers::resStruct(true);
    }
    
    private function _updateErrorMsg($training_id, $msg) {
        $doc = $this->get($training_id)['data'];
        $doc['error_msg'] = $msg;
        $save_ret = $this->model->save($training_id, $doc);
        return helpers::resStruct(false, $msg);
    }
    
}
