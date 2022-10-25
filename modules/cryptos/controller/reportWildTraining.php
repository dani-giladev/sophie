<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\wildTraining;

/**
 * reportWildTraining controller
 *
 * @author Dani Gilabert
 */
class reportWildTraining extends wildTraining
{
    
    public function toggleValidation($params)
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
        $doc['validated'] = !$doc['validated'];   
        $this->model->save($id, $doc);
        
        return helpers::resStruct(true);
    }
    
}
