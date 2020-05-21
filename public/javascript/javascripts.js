$("#selectRow").on('change', () => {
    let i = $("#selectRow option:selected").text();
    let a = i.split("_____")
    $("#loginRow").val(a[0].trim())
    $("#passwordRow").val(a[1].trim())
})