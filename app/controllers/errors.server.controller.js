'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
	var output;

	try {
		var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

	} catch (ex) {
		output = 'Unique field already exists';
	}

	return output;
};

/**
 * Get unique error field
 */
var getUniqueErrorField = function(err) {
    var fieldName = '';

    try {
        fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
    } catch (ex) {}

    return fieldName;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {

	var error = {
        message: '',
        field: ''
    };

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
                error.message = getUniqueErrorMessage(err);
                error.field   = getUniqueErrorField(err);
				break;
			default:
                error.message = 'Something went wrong';
		}
	} else if (err.message && !err.errors) {
        error.message = err.message;
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) error.message += err.errors[errName].message + '\n';
		}
	}

	return error;
};
