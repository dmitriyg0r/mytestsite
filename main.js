document.getElementById('uploadButton').addEventListener('click', function() {
    var files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        alert('Please select at least one photo.');
        return;
    }

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = (function(file) {
                return function(e) {
                    var img = document.createElement('img');
                    img.src = e.target.result;
                    img.title = file.name;
                    img.addEventListener('click', function() {
                        saveAs(dataURLtoBlob(e.target.result), file.name);
                    });
                    document.getElementById('gallery').appendChild(img);
                };
            })(file);
            reader.readAsDataURL(file);
        }
    }
});

function dataURLtoBlob(dataURL) {
    var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}