document.getElementById('compressBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image file');
        return;
    }

    const options = {
        maxSizeMB: 1, // Максимальный размер в мегабайтах
        maxWidthOrHeight: 1024, // Максимальная ширина или высота
        useWebWorker: true
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            document.getElementById('result').innerHTML = '';
            document.getElementById('result').appendChild(img);
            document.getElementById('downloadBtn').style.display = 'inline';
            document.getElementById('downloadBtn').onclick = () => {
                const a = document.createElement('a');
                a.href = img.src;
                a.download = 'compressed_image.jpg';
                a.click();
            };
        };
        reader.readAsDataURL(compressedFile);
    } catch (error) {
        console.error('Error compressing image:', error);
    }
});