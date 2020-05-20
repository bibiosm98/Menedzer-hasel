$("#selectRow").on('change', () => {
    let i = $("#selectRow option:selected").text();
    let a = i.split("  -  ")
    $("#loginRow").val(a[0])
    $("#passwordRow").val(a[1])
})