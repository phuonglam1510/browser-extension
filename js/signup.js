$(document).ready(function () {
    $(".form-register").submit(function (ev) {
        ev.preventDefault();
        let jForm = $(this);
        const params = `${jForm.serialize()}&firstName= &lastName=Wordsminer&dateOfBirth=2019-10-12T00:00:00.52Z&phone=1234567890`
        // console.log("data: ", params)
        aha.apiRegister(params).
            done(function (info) {
                $(".signup-alert").
                    toggleClass("alert-danger", false).
                    toggleClass("alert-success", true).
                    toggleClass("show", true).
                    toggleClass("hide", false);
                $(".signup-alert .message").text("Bạn đã đăng ký thành công");
                setTimeout(function () {
                    window.location.href = "/page/login.html";
                }, 1500)
            }).
            fail(function (jqXHR) {
                // console.log("err: ", jqXHR)
                $(".signup-alert").
                    toggleClass("alert-danger", true).
                    toggleClass("alert-success", false).
                    toggleClass("show", true).
                    toggleClass("hide", false);
                $(".signup-alert .message").text("Không thể đăng ký!");
            });
    })
})