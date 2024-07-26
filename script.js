document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const originalSizeElement = document.getElementById('originalSize');
        originalSizeElement.textContent = `Original Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    }
});

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

    // Показать загрузочную анимацию
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'inline-block';
    document.getElementById('result').innerHTML = '';
    document.getElementById('compressedSize').textContent = '';
    document.getElementById('downloadBtn').style.display = 'none';

    try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            document.getElementById('result').innerHTML = '';
            document.getElementById('result').appendChild(img);
            document.getElementById('compressedSize').textContent = `Compressed Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`;
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
    } finally {
        // Скрыть загрузочную анимацию
        loadingElement.style.display = 'none';
    }
});