$(document).ready(function () {
    checkLogin(function (loggedIn) {
        if (loggedIn) {
            window.location.href = "/page/home.html";
        } else {
            $(".form-login button").prop('disabled', false);
        }
    })

    $(".form-login").submit(function (ev) {
        $(".form-login button").prop('disabled', true);
        ev.preventDefault();
        let jForm = $(this);
        aha.apiLogin(jForm.serialize()).
            done(function (profile) {
                $(".login-alert").
                    toggleClass("alert-danger", false).
                    toggleClass("alert-success", true).
                    toggleClass("show", true).
                    toggleClass("hide", false);
                $(".login-alert .message").text("Welcome " + profile.lastName);
                setTimeout(function () {
                    window.location.href = "/page/home.html";
                }, 1500)
            }).
            fail(function (jqXHR) {
                $(".form-login button").prop('disabled', false);
                let status = jqXHR.status;
                let message = jqXHR.responseText;

                $(".login-alert").
                    toggleClass("alert-danger", true).
                    toggleClass("alert-success", false).
                    toggleClass("show", true).
                    toggleClass("hide", false);
                $(".login-alert .message").text("Cannot login: " + aha.util.firstLine(message));
            });
    });

    function checkLogin(cb) {
        aha.apiGetUserProfile().
            done(function (profile) {
                cb(true, false, profile)
            }).
            fail(function (jqXHR) {
                cb(false, true, jqXHR)
            });
    }
});