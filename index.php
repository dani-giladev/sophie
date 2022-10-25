<?php

/*
 * Google verification
 */
$raw_redirect_url = $_SERVER['REDIRECT_URL'];
$redirect_url = str_replace('/', '', $raw_redirect_url);

if (!isset($redirect_url) ||
    strlen($redirect_url) <= 'google.html' ||
    substr($redirect_url, 0, 6) !== 'google' || 
    substr($redirect_url, strlen($redirect_url) - 5, 5) !== '.html')
{
    die();
}

$pieces = explode('/', $redirect_url);
$file = $pieces[count($pieces) - 1];
$full_path = __DIR__."/res/google/".$file;
if (!file_exists($full_path))
{
    die();
}
        
echo file_get_contents($full_path);