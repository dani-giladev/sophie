<?php

namespace app\route\cryptos;

use modules\cryptos\controller\fiatFloating;

$app->group('/cryptos/fiatFloating/', function ()
{
    
    $this->map(['GET', 'POST'], 'getFiltered', function ($req, $res)
    {
        $um = new fiatFloating();
        
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
        $um = new fiatFloating();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->get($args['id'])
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'convert2Fiat', function ($req, $res)
    {
        $um = new fiatFloating();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->convert2Fiat(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'delete/{id}', function ($req, $res, $args)
    {
        $um = new fiatFloating();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->delete($args['id'])
            )
        );
    });
    
});
