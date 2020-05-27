$("#selectRow").on('change', () => {
    let i = $("#selectRow option:selected").text();
    let a = i.split("_____")
    $("#login").val(a[0].trim())
    $("#password").val(a[1].trim())
})