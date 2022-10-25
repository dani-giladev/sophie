<?php

namespace app\route\cryptos;

use modules\cryptos\controller\reportProfit;

$app->group('/cryptos/reportProfit/', function ()
{
    
    $this->map(['GET', 'POST'], 'getFiltered', function ($req, $res)
    {
        $um = new reportProfit();
        
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
    
    $this->map(['GET', 'POST'], 'getBalanceChart', function ($req, $res)
    {
        $um = new reportProfit();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getBalanceChart(
                    $req->getParsedBody()
                )
            )
        );
    });
    
});
