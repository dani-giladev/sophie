<?php

namespace app\route\cryptos;

use modules\cryptos\controller\wildTrainingGroup;

$app->group('/cryptos/wildTrainingGroup/', function ()
{
    
    $this->map(['GET', 'POST'], 'getFiltered', function ($req, $res)
    {
        $um = new wildTrainingGroup();
        
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
    
    $this->map(['GET', 'POST'], 'getAll', function ($req, $res)
    {
        $um = new wildTrainingGroup();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getAll(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->get('get/{id}', function ($req, $res, $args)
    {
        $um = new wildTrainingGroup();
        
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
        $um = new wildTrainingGroup();
        
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
        $um = new wildTrainingGroup();
        
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
    
});
