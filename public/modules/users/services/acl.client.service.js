'use strict';

angular.module('users').service('Acl', ['Authentication', '$state',
    function (Authentication, $state) {
        var authentication = Authentication;

        var abilities = {
            'scanifly-admin'         : ['dashboard-submittedCompany', 'user-management', 'company-management', 'project-processing', 'view-pre-report', 'download-report'],
            'customer-admin'         : ['dashboard-submittedUser', 'assessment-feedback', 'billing', 'new-scan', 'user-management', 'user-management-customerType', 'edit-company', 'download-report', 'edit-project', 'download-project-files', 'tutorials'],
            'customer-systemDesigner': ['dashboard-submittedUser', 'assessment-feedback', 'download-report', 'download-project-files', 'tutorials'],
            'guest'                  : []
        };

        return {

            hasAccess: function (resource) {
                var role = (authentication.user && abilities[authentication.user.role]) ? authentication.user.role : 'guest';

                return (abilities[role].indexOf(resource) !== -1);
            },

            handleAuthenticationRedirects: function (event, toState, toParams) {

                if (angular.isDefined(toState.authenticate)) {
                    if (!Authentication.user && (toState.authenticate === true)) {
                        $state.go('signin');
                        event.preventDefault();
                    } else if (Authentication.user && (toState.authenticate === false)) {
                        $state.go('dashboard');
                        event.preventDefault();
                    }
                }

            }

        };
    }
]);
