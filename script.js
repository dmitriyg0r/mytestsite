const fileInput = document.getElementById('fileInput');
const compressBtn = document.getElementById('compressBtn');
const originalSizeElement = document.getElementById('originalSize');
const preview = document.getElementById('preview');
const progressBar = document.getElementById('progressBar');
const loadingElement = document.getElementById('loading');
const resultElement = document.getElementById('result');
const compressedSizeElement = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;

    if (files.length > 0) {
        originalSizeElement.textContent = `Выбрано изображений: ${files.length}`;
        compressBtn.style.display = 'inline';

        preview.innerHTML = '';
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    } else {
        originalSizeElement.textContent = '';
        compressBtn.style.display = 'none';
        preview.innerHTML = '';
    }
});

compressBtn.addEventListener('click', async () => {
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Please select image files');
        return;
    }

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        onProgress: (progress) => {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
        }
    };

    progressBar.style.display = 'block';
    compressBtn.style.display = 'none';
    loadingElement.style.display = 'inline-block';
    resultElement.innerHTML = '';
    compressedSizeElement.textContent = '';
    downloadBtn.style.display = 'none';

    try {
        for (const file of files) {
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                resultElement.appendChild(img);
                compressedSizeElement.textContent = `Сжатый размер: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`;
                downloadBtn.style.display = 'inline';
                downloadBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = img.src;
                    a.download = 'compressed_image.jpg';
                    a.click();
                };
            };
            reader.readAsDataURL(compressedFile);
        }
    } catch (error) {
        console.error('Error compressing image:', error);
        alert('Failed to compress image. Please try again.');
    } finally {
        loadingElement.style.display = 'none';
        progressBar.style.display = 'none';
        compressBtn.style.display = 'inline';
    }
});