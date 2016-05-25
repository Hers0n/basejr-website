<?php
header('Access-Control-Allow-Origin: http://localhost:9000');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

$app = new \Slim\App;

$app->post('/mail', function (Request $request, Response $response) {

    $status = 400;
    $list_file = 'data/email-list.json';
    $list = array();

    $list_temp = file_get_contents($list_file);

    if ($list_temp) {
        $list = json_decode($list_temp, true);

    } else {
        $newResponse = $response->withStatus(400);
        return $newResponse;
    }

    $email = $request->getParam('email');

    if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $is_new = true;

        if ($list && !empty($list)) {
            foreach ($list as $item) {
                if ($item == $email) {
                    $is_new = false;
                    break;
                }
            }
        }

        if ($is_new) {
            array_push($list, $email);

            if (file_put_contents($list_file, json_encode($list))) {
                $status = 200;
            }

        } else {
            $status = 202;
        }
    }

    $newResponse = $response->withStatus($status);
    return $newResponse;
});

$app->run();
