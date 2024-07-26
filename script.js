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
                    img.addEventListener('click', function() {
                        showPreview(e.target.result);
                    });
                    gallery.appendChild(img);
                };
            })(file);
            reader.readAsDataURL(file);
        }
    }
});

function showPreview(imageSrc) {
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    previewImage.src = imageSrc;
    previewContainer.style.display = 'flex';

    previewContainer.addEventListener('click', function() {
        previewContainer.style.display = 'none';
    });
}