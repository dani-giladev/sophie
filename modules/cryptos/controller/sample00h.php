<?php

namespace modules\cryptos\controller;

// Controllers
use modules\cryptos\controller\sample;

/**
 * Sample at 00h controller
 *
 * @author Dani Gilabert
 */
class sample00h extends sample
{
    
    protected function _getSamplesByIntervalAndDateView()
    {
        return $this->model->getView("samples00hByIntervalAndDate");
    }
    
}
