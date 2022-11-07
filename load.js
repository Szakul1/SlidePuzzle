function loadImages() {
    var rows = document.getElementById("rows");
    var columns = document.getElementById("columns");
    var images = document.getElementsByClassName("image")

    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener("click", function (e) {
            location.href = "game.html?" + (i + 1) + "?" + rows.value
                + "?" + columns.value;
        });
    }
    new Promise(function (resolve, reject) {
        for (var i = 0; i < images.length; i++)
            images[i].src = "images/image" + (i + 1) + ".jpg";
    })

}