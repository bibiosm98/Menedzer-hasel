$("#password").on('change', () => {
    const password = $("#password").val()
    // alert(password)
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
    }).done((response, res) => {
        console.log(response)
        console.log(res)
        $("#strength").html(res.passwordStrength)
    })
})

$("#password").on('change', () => {
    check()
})
$("#password-repeat").on('change', () => {
    check()
})
function check(){
    $('#password-error').text("");
    if($('#password').val() !== $('#password-repeat').val()){   
        $('#password-error').text("Passwords not equals");
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