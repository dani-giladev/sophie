<?php

namespace app\route\cryptos;

use modules\cryptos\controller\floating;

$app->group('/cryptos/floating/', function ()
{
    
    $this->map(['GET', 'POST'], 'getFiltered', function ($req, $res)
    {
        $um = new floating();
        
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
        $um = new floating();
        
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
        $um = new floating();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->delete($args['id'])
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'sellPendingTransactions', function ($req, $res)
    {
        $um = new floating();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->sellPendingTransactions(
                    $req->getParsedBody()
                )
            )
        );
    });
    
});
