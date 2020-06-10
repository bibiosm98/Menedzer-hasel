$("#password").on('change', () => {
    const password = $("#password").val()
    const data = {
        "password": password
    }
    const link = 'https://fast-ridge-60024.herokuapp.com/api/PasswordStrength'
    $.ajax({
        url         : link,
        method      : "post",
        dataType    : "json",
        contentType : "application/json",
        data        : JSON.stringify(data)
    }).done((res) => {
        console.log(res);
        $("#strength").html(res.passwordStrength)
    })
    console.log("as");
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

// $("#email-error").on('change', () => {
    // $('#email-error').text("");
// })

// $("#container").on('change', ()=>{
//     if(
//         $('#pass-1').val() !== '' && 
//         $('#pass-1').val() === $('#pass-2').val() && 
//         $('#name').val() !== '' && 
//         $('#email').val() !== ''
//     ){
//         $('#btn-create-user').removeClass("btn-primary-disabled").addClass("btn-primary")
//     }
// })