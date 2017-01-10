'use strict';

module.exports = {
    assets           : {
        lib  : {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'https://fonts.googleapis.com/css?family=Titillium+Web:400,600,300,300italic,700',
                'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true',
                'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',
                'public/lib/datatables/media/css/jquery.dataTables.css',
                'public/lib/datatables-responsive/css/dataTables.responsive.css',
                'public/lib/angular-carousel/dist/angular-carousel.css',
                'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css',
                'public/lib/object-fit/dist/polyfill.object-fit.css',
                'public/lib/flexslider/flexslider.css'
            ],
            js : [
                'public/lib/jquery/dist/jquery.js',
                'public/lib/underscore/underscore.js',
                'public/lib/datatables/media/js/jquery.dataTables.js',
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-flexslider/angular-flexslider.js',
                'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
                'public/lib/angular-adaptive-detection/src/angular-adaptive-detection.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-datatables/dist/angular-datatables.js',
                'public/lib/object-fit/dist/polyfill.object-fit.js',
                'public/lib/ng-file-upload/ng-file-upload-shim.js',
                'public/lib/ng-file-upload/ng-file-upload.js',
                'public/lib/angular-underscore-module/angular-underscore-module.js',
                'https://maps.googleapis.com/maps/api/js?sensor=false',
                'public/lib/angular-google-maps/dist/angular-google-maps.js',
                'public/lib/raphael/raphael.js',
                'public/lib/us-map/jquery.usmap.js',
                'public/lib/datatables-responsive/js/dataTables.responsive.js',
                'public/lib/flexslider/jquery.flexslider.js'
            ]
        },
        css  : [
            'public/modules/**/css/*.css'
        ],
        js   : [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/**/*.js'
        ],
        tests: []
    }
};
