$("#password").on('change', () => {
    const password = $("#password").val()
    let dane = {
        "password": password
    }
    console.log(dane)
    $.ajax({
        // url: 'https://menedzerhasel.herokuapp.com/signup/PublicRsaKey',
        url: 'http://localhost:3000/signup/PublicRsaKey',
        method: 'get',
    }).done(async (publicRsaKey) => {
        console.log("Getting public RSA key from server")
        console.log(publicRsaKey)
        // let key = encryptoKey();
        let key = await importPublicKey(publicRsaKey);
        console.log("KEY imported = ")
        console.log(key)
        
        $.ajax({
            type: "post",
            // url: 'https://menedzerhasel.herokuapp.com/signup/checkStrength',
            url: 'http://localhost:3000/signup/checkStrength',
            data: {"password": password}
            // data: {"password": encrypto(key, dane)}
        }).done((res) => {
            console.log(res);
            $("#strength").html(res.strength)
        })
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


// -----BEGIN RSA PUBLIC KEY-----
// MIGJAoGBANHjPrZ866c2dcG5tF3Uacrw5eWMzb3EfqpxuXEjyKga+nxTBM5Q0Ica
// 3iaSSvzqjWNgU51qga00OJlbV0cVH38X/itKJWOEyKA46PA5/GrWg1znavE6fvC6
// mF0OaYI/FSwnHwiF/d/QcU7LVdj7pJugLOu6RhFUkGdlzzeWr65FAgMBAAE=
// -----END RSA PUBLIC KEY-----

// function encryptoKey(){
//     window.crypto.subtle.generateKey(
//         {
//             name: "RSA-OAEP",
//             modulusLength: 2048, //can be 1024, 2048, or 4096
//             publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
//             hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
//         },
//         false, //whether the key is extractable (i.e. can be used in exportKey)
//         ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
//     )
//     .then(function(key){
//         //returns a keypair object
//         console.log(key);
//         console.log(key.publicKey);
//         console.log(key.privateKey);
//         return(key.publicKey)
//     })
//     .catch(function(err){
//         console.error(err);
//     });
// }

// function importKey(){
//     window.crypto.subtle.importKey(
//         "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
//         {   //this is an example jwk key, other key types are Uint8Array objects
//             kty: "RSA",
//             e: "AQAB",
//             n: "vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE",
//             alg: "RSA-OAEP-1",
//             ext: true,
//         },
//         {   //these are the algorithm options
//             name: "RSA-OAEP",
//             hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
//         },
//         false, //whether the key is extractable (i.e. can be used in exportKey)
//         ["encrypt"] //"encrypt" or "wrapKey" for public key import or
//                     //"decrypt" or "unwrapKey" for private key imports
//     )
//     .then(function(publicKey){
//         //returns a publicKey (or privateKey if you are importing a private key)
//         console.log(publicKey);
//     })
//     .catch(function(err){
//         console.error(err);
//     });
// }

// function encrypto(publicKey, data){

//     window.crypto.subtle.encrypt(
//         {
//             name: "RSA-OAEP",
//             //label: Uint8Array([...]) //optional
//         },
//         publicKey, //from generateKey or importKey above
//         //data //ArrayBuffer of data you want to encrypt
//         new ArrayBuffer(data)
//     )
//     .then(function(encrypted){
//         //returns an ArrayBuffer containing the encrypted data
//         console.log(new Uint8Array(encrypted));
//     })
//     .catch(function(err){
//         console.error(err);
//     });
// }

function convertPemToBinary(pem) {
    var lines = pem.split('\n')
    console.log("conver pem to binary")
    var encoded = ''
    for(var i = 0;i < lines.length;i++){
      if (lines[i].trim().length > 0 &&
          lines[i].indexOf('-----BEGIN RSA PRIVATE KEY-----') < 0 &&
          lines[i].indexOf('-----BEGIN RSA PUBLIC KEY-----') < 0 &&
          lines[i].indexOf('-----END RSA PRIVATE-----') < 0 &&
          lines[i].indexOf('-----END RSA PUBLIC KEY-----') < 0) {
        encoded += lines[i].trim()
      }
    }
    return base64StringToArrayBuffer(encoded)
}
function base64StringToArrayBuffer(b64str) {
    console.log("base64StringToArrayBuffer")
    var byteStr = atob(b64str)
    var bytes = new Uint8Array(byteStr.length)
    for (var i = 0; i < byteStr.length; i++) {
        bytes[i] = byteStr.charCodeAt(i)
    }
    console.log("RETURN base64StringToArrayBuffer")
    console.log(bytes)
    console.log(bytes.buffer)
    return bytes.buffer
}

function importPublicKey(pemKey) {
    return new Promise(function(resolve) {
        var importer = crypto.subtle.importKey("spki", convertPemToBinary(pemKey), signAlgorithm, true, ["encrypt"])
            importer.then(function(key) {
                console.log("PUBLIC KEY = ")
                console.log(key)
                resolve(key)
            }
        )
    })
}

var signAlgorithm = {
    name: "RSA-PKCS1",
    hash: {
        name: "SHA-256"
    },
    modulusLength: 1024,
    extractable: false,
    publicExponent: new Uint8Array([1, 0, 1])
}