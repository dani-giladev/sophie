<?php

namespace app\route\cryptos;

use modules\cryptos\controller\fiatCoin;

$app->group('/cryptos/fiatCoin/', function ()
{
    
    $this->map(['GET', 'POST'], 'getAll', function ($req, $res)
    {
        $um = new fiatCoin();
        
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
    
});
