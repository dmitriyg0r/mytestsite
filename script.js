document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = ''; // Очищаем галерею перед добавлением новых фото

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (function(file) {
                return function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.title = file.name;
                    gallery.appendChild(img);
                };
            })(file);
            reader.readAsDataURL(file);
        }
    }
});