'use strict';
/*jshint loopfunc: true */

/**
 * Module dependencies.
 */
var request = require('request'),
    pdf     = require('pdfcrowd'),
    config  = require('../../config/config');

/**
 * Create a Download
 */
exports.generatePdfFromProject = function (req, res) {

    var project                   = req.project;
    project.geoLocation.latitude  = project.geoLocation.latitude.toFixed(4);
    project.geoLocation.longitude = project.geoLocation.longitude.toFixed(4);

    res.render('templates/project-details-pdf',
        {
            project: project
        },
        function (err, html) {

            var client = new pdf.Pdfcrowd(config.pdfCrowd.name, config.pdfCrowd.key);

            client.convertHtml(html, pdf.sendHttpResponse(res), {
                initial_pdf_zoom_type: 3,
                width                : '11.69in',
                height               : '8.27in',
                margin_top           : 0,
                margin_bottom        : 0,
                margin_left          : 0,
                margin_right         : 0
            });
        }
    );

};

exports.generateShadeReportPdf = function (req, res) {

    var project                   = req.project;
    project.geoLocation.latitude  = project.geoLocation.latitude.toFixed(4);
    project.geoLocation.longitude = project.geoLocation.longitude.toFixed(4);

    res.render('templates/project-shade-report-pdf',
        {
            project: project,
            multiplyPercentages : function(x, y) {
                return (((x/100) * (y/100)) * 100).toFixed(0);
            }
        },
        function (err, html) {
            if(err) {
                console.log(err);
                res.end();
            } else {

                var client = new pdf.Pdfcrowd(config.pdfCrowd.name, config.pdfCrowd.key);
                client.convertHtml(html, pdf.sendHttpResponse(res), {
                    initial_pdf_zoom_type: 3,
                    width                : '11.69in',
                    height               : '8.27in',
                    margin_top           : 0,
                    margin_bottom        : 0,
                    margin_left          : 0,
                    margin_right         : 0
                
                });

                // res.send(html);

            }

        }
    );

};
