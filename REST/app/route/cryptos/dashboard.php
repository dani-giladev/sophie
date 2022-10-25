<?php

namespace app\route\cryptos;

use modules\cryptos\controller\dashboard;

$app->group('/cryptos/dashboard/', function ()
{
    
    $this->map(['GET', 'POST'], 'getDashboard', function ($req, $res)
    {
        $um = new dashboard();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getDashboard(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getChangeTimeData', function ($req, $res)
    {
        $um = new dashboard();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getChangeTimeData(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getOpenBuyingsData', function ($req, $res)
    {
        $um = new dashboard();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getOpenBuyingsData(
                    $req->getParsedBody()
                )
            )
        );
    });
    
});
