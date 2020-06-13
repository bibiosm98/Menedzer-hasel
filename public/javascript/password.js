$("#password").on('change', () => {
    const password = $("#password").val()
    $.ajax({
        type: "post",
        url: 'http://localhost:3000/signup/checkStrength',
        data: {
            "password": password
        },
    }).done((res) => {
        console.log(res);
        $("#strength").html(res.strength)
    })
})

$("#password").on('change', () => {
    check()
})
$("#password-repeat").on('change', () => {
    check()
})
function check(){
    console.log("check()");
    $('#password-error').text("");
    $('#btn-submit').prop('disabled', false);
    if($('#password').val() !== $('#password-repeat').val()){   
        $('#password-error').html("Passwords not equals");
        $('#btn-submit').prop('disabled', true);
    }
}