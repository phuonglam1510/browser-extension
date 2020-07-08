$(document).ready(function () {
    let current_url = window.location;
    $('.dropdown-menu a').filter(function () {
        return this.href == current_url;
    }).last().addClass('active');

    aha.apiGetUserProfile().
        done(function (profile) {
            if (!profile.authName) {
                $(".profile__name").text('Wordminer')
            } else {
                $(".profile__name").text(profile.authName.toUpperCase())
            }
            $(".input-email").val(profile.authEmail);
            $(".input-join").val(aha.formatDayMonthYear(profile.createdAt));
        }).
        fail(function (jqXHR) {
            $(".user-profile-nav").toggleClass("d-none", true);
            $(".login-nav").toggleClass("d-none", false);
            window.location.href = "/page/login.html";
        });


    $(".btn-logout").click(aha.onClickLogout)

    function getCookie() {
        chrome.cookies.get({ url: 'https://app.grammarly.com/', name: 'browser_info' },
            function (cookie) {
                if (cookie) {
                    console.log(cookie.value);
                }
                else {
                    console.log('Can\'t get cookie! Check the name!');
                }
            });
    }

    $(".profile__delete-button").click(getCookie)
})
