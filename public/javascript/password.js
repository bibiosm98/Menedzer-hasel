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

$("#password").on('change', () => {
    const password = $("#password").val()
    let dane = {
        "password": password
    }
    console.log(dane)
    // $.ajax({
    //     // url: 'https://menedzerhasel.herokuapp.com/signup/PublicRsaKey',
    //     url: 'http://localhost:3000/signup/PublicRsaKey',
    //     method: 'get',
    // }).done(async (key) => {
    //     console.log("Getting public RSA key from server")
    //     console.log(key.public)
    //     window.RSAOAEP = {
    //         name: "RSA-OAEP",
    //         //NOTE: THIS IS A SMALL MODULUS FOR TESTING ONLY
    //         //DO NOT USE IT FOR REAL! USE AT LEAST 2048
    //         modulusLength: 1024,
    //         publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    //         hash: {name: "SHA-256"}
    //     }
    //     // window.crypto.subtle.importKey(
    //     //     'spki', 
    //     //     str2ab(key.public), {
    //     //       name:  "RSA-OAEP",
    //     //       hash: {name: 'SHA-256'}
    //     //     },
    //     //     false,
    //     //     ['verify']
    //     // )
    //     let arrayw = new Uint8Array([
    //         48,129,159,48,13,6,9,42,134,72,134,247,13,1,1,1,5,0,3,
    //         129,141,0,48,129,137,2,129,129,0,182,93,35,213,252,204,
    //         20,103,91,238,105,199,53,114,24,221,114,210,137,173,88,
    //         76,205,113,148,148,79,80,59,208,60,75,231,248,78,125,12,
    //         30,237,226,63,146,157,203,239,60,138,123,234,50,23,174,
    //         216,33,122,16,53,246,140,254,75,246,205,204,117,204,115,
    //         29,178,102,139,201,74,177,45,131,183,166,234,61,124,75,
    //         110,3,70,202,148,95,45,228,94,95,148,2,162,79,146,137,29,
    //         189,102,75,207,214,116,58,63,171,219,27,5,9,108,16,218,23,
    //         169,43,181,119,31,172,95,205,180,18,255,203,2,3,1,0,1
    //     ])


    //     let message = password
    //     let enc = new TextEncoder()
    //     let enco =  enc.encode(message)

    //     console.log("Array.len = " + arrayw.length)
    //     window.crypto.subtle.importKey("spki", str2ab(key.public), RSAOAEP, false, ["encrypt"])
    //     .then(function(publicKEy) {
    //         console.log('imported public key')
    //         console.log(publicKEy);
    //         window.RSAOAEP = {
    //             name: "RSA-OAEP",
    //             //NOTE: THIS IS A SMALL MODULUS FOR TESTING ONLY
    //             //DO NOT USE IT FOR REAL! USE AT LEAST 2048
    //             modulusLength: 1024,
    //             // hash: {name: "SHA-256"},
    //             publicExponent: new Uint8Array([0x01, 0x00, 0x01])
    //         }
    //         window.TESTBYTES = new Uint8Array([1, 2, 3, 4]);
    //         window.crypto.subtle.encrypt(
    //             RSAOAEP, 
    //             publicKEy, 
    //             enco
    //         ).then((result) => {
    //             console.log(result)
    //             console.log(btoa(result))
    //             console.log(result)
    //                 let binary = "";
    //                 let len = result.byteLength;
    //                 for (let i = 0; i < len; i++) {
    //                   binary += String.fromCharCode(result[i]);
    //                 }
    //                 let encrypted = window.btoa(binary);
    //                 let buffer = new Uint8Array(result, 0, 5);
    //                 console.log(buffer)
                $.ajax({
                    type: "post",
                    // url: 'https://menedzerhasel.herokuapp.com/signup/checkStrength',
                    url: 'http://localhost:3000/signup/checkStrength',
                    data: {"password": password}//btoa(result)}
                    // data: {"password": encrypto(key, dane)}
                }).done((res) => {
                    console.log(res);
                    $("#strength").html(res.strength)
                })
    //         })


    //     }).catch(function(err) {
    //         console.log('error')
    //         console.log(err);
    //     });


    // })
})

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    
    // return buf;
    return bufView;
}