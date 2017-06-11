<?php

/**
 * Created by PhpStorm.
 * User: vidura
 * Date: 11/06/17
 * Time: 4:58 PM
 */

use Doctrine\DBAL\Connection;
require_once __DIR__.'/../app.php';

class guest
{
    public function getAllGuests($app)
    {
        $sql = "SELECT * FROM guest_book ";
        $post = $app['db']->fetchAll($sql);

        return  $app->json($post);
    }

    public function save($app,$data)
    {
        $app['db']->insert('guest_book', $data);
        return true;
    }
}