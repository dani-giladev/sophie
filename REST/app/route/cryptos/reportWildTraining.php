<?php

namespace app\route\cryptos;

use modules\cryptos\controller\reportWildTraining;

$app->group('/cryptos/reportWildTraining/', function ()
{
    
    $this->map(['GET', 'POST'], 'getFiltered', function ($req, $res)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getFiltered(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->get('get/{id}', function ($req, $res, $args)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->get($args['id'])
            )
        );
    });

    $this->map(['GET', 'POST'], 'delete/{id}', function ($req, $res, $args)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->delete($args['id'])
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'save', function ($req, $res)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->save(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'toggleProgressStatus', function ($req, $res)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->toggleProgressStatus(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'toggleValidation', function ($req, $res)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->toggleValidation(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getTrainingRobot', function ($req, $res)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getTrainingRobot(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'updateTheWinner', function ($req, $res)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->updateTheWinner(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'automaticWinnerUpdate', function ($req, $res)
    {
        $um = new reportWildTraining();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->automaticWinnerUpdate(
                    $req->getParsedBody()
                )
            )
        );
    });
    
});
