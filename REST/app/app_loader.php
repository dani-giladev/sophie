<?php

$base = __DIR__ . '/../app/';

/*
 * Include route
 * 
 * @author Default user
 */
$url = $_SERVER['REDIRECT_URL'];
$needle = '/REST/public/';
$cleanurl = substr($url, strpos($url, $needle) + strlen($needle));
$url_pieces = explode('/', $cleanurl);
$module = $url_pieces[0];
$model = $url_pieces[1];    
$filename = $base . "route/".$module."/".$model.".php";
require $filename;