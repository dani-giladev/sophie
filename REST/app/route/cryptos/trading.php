<?php

namespace app\route\cryptos;

use modules\cryptos\controller\trading\trading;
use modules\cryptos\controller\trading\tradingTraining;

$app->group('/cryptos/trading/', function ()
{
    
    $this->map(['GET', 'POST'], 'getMainChartData', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getMainChartData(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getSecondChartData', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getSecondChartData(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getRealTimeData', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getRealTimeData(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getHistory', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getHistory(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'startStopRobot', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->startStopRobot(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'buy', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->buy(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'sell', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->sell(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'sellAndStop', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->sellAndStop(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'sellCalmlyAndStop', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->sellCalmlyAndStop(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getDateOfSample', function ($req, $res)
    {
        $params = $req->getParsedBody();
        $um = ($params['is_training'] == 'true')? new tradingTraining() : new trading();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getDateOfSample(
                    $params
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'train', function ($req, $res)
    {
        $um = new tradingTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->train(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getTrainingProgress', function ($req, $res)
    {
        $um = new tradingTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getTrainingProgress(
                    $req->getParsedBody()
                )
            )
        );
    });
    
});
