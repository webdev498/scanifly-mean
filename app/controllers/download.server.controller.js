'use strict';
/*jshint loopfunc: true */

/**
 * Module dependencies.
 */
var request = require('request');
var JSZip   = require('jszip');
var fs      = require('fs');
var q       = require('q');
var config  = require('../../config/config');
var zip     = new JSZip();

var getFileExtension = function (fileName) {
    return fileName.substr((~-fileName.lastIndexOf('.') >>> 0) + 2);
};

var getFile = function (fileUrl) {

    var defer = q.defer();

    var requestSettings = {
        method  : 'GET',
        url     : fileUrl,
        encoding: null
    };

    request(requestSettings, function (error, response, body) {

        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(body);
        }
    });

    return defer.promise;
};

var zipFiles = function (files) {

    var promises = [];

    if (files && files.length) {

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            var promise = (function (fileItem) {
                return getFile(fileItem.imagePath)
                    .then(function (data) {

                        if (fileItem.dir) {
                            zip.folder(fileItem.dir).file(fileItem.name, data, {binary: true});
                        } else {
                            zip.file(fileItem.name, data, {binary: true});
                        }

                    }, function (err) {
                        console.error('error on ', fileItem.name, err);
                    });

            })(file);

            promises.push(promise);
        }
    }

    return q.all(promises);
};

var prepareFiles = function (project) {

    var files = [], i, file;

    // top image
    files.push({
        imagePath: project.details.droneImages.topImage[0].imagePath,
        name     : 'top-image.' + getFileExtension(project.details.droneImages.topImage[0].name)
    });

    // eye view
    for (i = 0; i < project.details.droneImages.eyeView.length; i++) {
        file = project.details.droneImages.eyeView[i];

        files.push({
            imagePath: file.imagePath,
            dir      : 'eye-view',
            name     : 'eye-view-' + (i + 1) + '.' + getFileExtension(file.name)
        });
    }

    // additional files
    for (i = 0; i < project.details.additionalFiles.length; i++) {
        file = project.details.additionalFiles[i];

        files.push({
            imagePath: file.imagePath,
            dir      : 'additional-files',
            name     : 'additional-files-' + (i + 1) + '.' + getFileExtension(file.name)
        });
    }

    // satellite view
    files.push({
        imagePath: project.propertyImage,
        name     : 'satellite-view.png'
    });

    // project details pdf
    files.push({
        imagePath: config.baseUrl + '/generate-pdf/' + project._id,
        name     : 'project-details.pdf'
    });

    // project details pdf
    files.push({
        imagePath: config.baseUrl + '/generate-shade-report-pdf/' + project._id,
        name     : 'project-shade-report.pdf'
    });

    return files;
};

exports.getZip = function (req, res) {

    zip         = new JSZip();
    var project = req.project;
    var files   = prepareFiles(project);

    zipFiles(files).then(function (returnedData) {
        var content = zip.generate({type: 'nodebuffer'});

        res.setHeader('Content-disposition', 'attachment; filename=' + project.name.replace(/\s/g, '_') + '-report.zip');
        res.setHeader('Content-type', 'application/zip');

        res.send(content);

    }, function (error) {
        console.log(error);
    });

};

exports.getShadeReportZip = function (req, res) {

    zip             = new JSZip();
    var project     = req.project;
    var shadeReport = [{
        imagePath: config.baseUrl + '/generate-shade-report-pdf/' + project._id,
        name     : 'project-shade-report.pdf'
    }];

    zipFiles(shadeReport).then(function (returnedData) {
        var content = zip.generate({type: 'nodebuffer'});

        res.setHeader('Content-disposition', 'attachment; filename=' + project.name.replace(/\s/g, '_') + '-shade-report.zip');
        res.setHeader('Content-type', 'application/zip');

        res.send(content);

    }, function (error) {
        console.log(error);
    });

};

exports.getFile = function (req, res) {
    request(decodeURIComponent(req.query.url)).pipe(res);
};
