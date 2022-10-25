<?php

/* 
 * cryptos module configuration file
 */

$config = array(
    "NAME"      => "cryptos",
    "VERSION"   => "1.0.0.0",
    "ICON"      => "x-fa fa-line-chart",

    "DBPARAMS" => array(
        "KEYS_STORE_PATH" => array(
            "desc" => "Path absolut on es troben les claus de les apis",
            "default_value" => '/opt/sophie/keys_store'
        ),
    ),

    "MENU"      => array(
        "UI"    => array(
            array(
                "alias"     => "cryptos-admin",
                "label"     => "",
                "icon"      => "x-fa fa-cog",
                "children"  => array(
                    array(
                        "alias"     => "cryptos-userGroup",
                        "icon"      => "x-fa fa-group",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-user",
                        "icon"      => "x-fa fa-user",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-config",
                        "icon"      => "x-fa fa-cog",
                        "label"     => "",
                        "children"  => array()
                    )
                )
            ),
            array(
                "alias"     => "cryptos-main",
                "label"     => "",
                "icon"      => "x-fa fa-sun-o",
                "children"  => array(
                    array(
                        "alias"     => "cryptos-robot",
                        "icon"      => "x-fa fa-github-alt",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-robotGroup",
                        "icon"      => "x-fa fa-weixin",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-symbol",
                        "icon"      => "x-fa fa-bitcoin",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-marketCoin",
                        "icon"      => "x-fa fa-trademark",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-wildTrainingGroup",
                        "icon"      => "x-fa fa-delicious",
                        "label"     => "",
                        "children"  => array()
                    ),
// [WIZARD_MAINTENANCE_MENU_UI_TAG]                                       
                )
            ),
            array(
                "alias"     => "cryptos-operative",
                "label"     => "",
                "icon"      => "x-fa fa-star",
                "children"  => array(
                    array(
                        "alias"     => "cryptos-dashboard",
                        "icon"      => "x-fa fa-pie-chart",
                        "default"   => true, // true - false -- Will be opened automatically by UI
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-floating",
                        "icon"      => "x-fa fa-frown-o", //fa-circle-o-notch", //fa-life-ring
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-reportProfit",
                        "icon"      =>  "x-fa fa-percent",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-fiatFloating",
                        "icon"      => "x-fa fa-meh-o",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-reportFiatProfit",
                        "icon"      =>  "x-fa fa-usd",
                        "label"     => "",
                        "children"  => array()
                    )
                )
            ),
            array(
                "alias"     => "cryptos-reports",
                "label"     => "",
                "icon"      => "x-fa fa-list",
                "children"  => array(
                    array(
                        "alias"     => "cryptos-reportTransaction",
                        "icon"      => "x-fa fa-bars", //fa-usd",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-manualTransaction",
                        "icon"      => "x-fa fa-sign-language",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-reportRobots",
                        "icon"      => "x-fa fa-github-alt",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-historyRobotChanges",
                        "icon"      => "x-fa fa-exchange",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-reportTraining",
                        "icon"      => "x-fa fa-bicycle",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-reportWildTraining",
                        "icon"      => "x-fa fa-gavel",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "cryptos-pump",
                        "icon"      => "x-fa fa-bomb",
                        "label"     => "",
                        "children"  => array()
                    )
                )
            ),
            array(
                "alias"     => "cryptos-trading",
                "label"     => "",
                "icon"      => "x-fa fa-line-chart",
                //"default"   => true,
                "children"  => array()
            )
        ),
        "admin" => array(
            array(
                "alias"     => "cryptos-userGroup",
                "icon"      => "x-fa fa-group",
                "label"     => "",
                "children"  => array()
            ),
            array(
                "alias"     => "cryptos-user",
                "icon"      => "x-fa fa-user",
                "label"     => "",
                "children"  => array()
            ),
            array(
                "alias"     => "cryptos-config",
                "icon"      => "x-fa fa-cog",
                "label"     => "",
                "children"  => array()
            )
        )        
    )
);
