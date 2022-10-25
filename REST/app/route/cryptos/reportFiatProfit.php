<?php

namespace app\route\cryptos;

use modules\cryptos\controller\reportFiatProfit;

$app->group('/cryptos/reportFiatProfit/', function ()
{
    
    $this->map(['GET', 'POST'], 'getFiltered', function ($req, $res)
    {
        $um = new reportFiatProfit();
        
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
    
});
