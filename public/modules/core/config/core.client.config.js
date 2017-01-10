'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
    function (Menus) {

        Menus.addMenuItem('header', 'Features', 'features', null, '/features', true);
        // Menus.addMenuItem('header', 'Where We Scan', 'where-we-scan', null, '/where-we-scan', true);
        Menus.addMenuItem('header', 'Contact Us', 'contact', null, '/contact', true);

        Menus.addMenuItem('footer', 'Home', 'home', null, '/', true);
        Menus.addMenuItem('footer', 'Features', 'features', null, '/features', true);
        // Menus.addMenuItem('footer', 'Where We Scan', 'where-we-scan', null, '/where-we-scan', true);
        Menus.addMenuItem('footer', 'About Us', 'about-us', null, '/about-us', true);
        Menus.addMenuItem('footer', 'Contact', 'contact', null, '/contact', true);
        Menus.addMenuItem('footer', 'Terms & Conditions', 'terms-and-conditions', null, '/terms-and-conditions', true);
    }
]);
