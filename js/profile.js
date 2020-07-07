$(document).ready(function () {
    let current_url = window.location;
    $('.dropdown-menu a').filter(function () {
        return this.href == current_url;
    }).last().addClass('active');

    function getDayMonthYear(time) {
        const d = new Date(time);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        return [day, month, year].join('/');
    }

    aha.apiGetUserProfile().
        done(function (profile) {
            $(".profile__name").text(profile.authName.toUpperCase());
            $(".input-email").val(profile.authEmail);
            $(".input-join").val(getDayMonthYear(profile.createdAt));
        }).
        fail(function (jqXHR) {
            $(".user-profile-nav").toggleClass("d-none", true);
            $(".login-nav").toggleClass("d-none", false);
            window.location.href = "/page/login.html";
        });



})
