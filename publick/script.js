document.getElementById('uploadButton').addEventListener('click', function() {
    var files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        alert('Please select at least one photo.');
        return;
    }

    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append('photos', files[i]);
    }

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        loadPhotos();
    })
    .catch(error => console.error('Error:', error));
});

function loadPhotos() {
    fetch('http://localhost:3000/photos')
        .then(response => response.json())
        .then(photos => {
            var gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            photos.forEach(photo => {
                var img = document.createElement('img');
                img.src = photo.path;
                img.title = photo.filename;
                gallery.appendChild(img);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load photos on page load
loadPhotos();