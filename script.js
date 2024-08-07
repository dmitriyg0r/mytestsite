const fileInput = document.getElementById('fileInput');
const compressBtn = document.getElementById('compressBtn');
const originalSizeElement = document.getElementById('originalSize');
const preview = document.getElementById('preview');
const progressBar = document.getElementById('progressBar');
const loadingElement = document.getElementById('loading');
const resultElement = document.getElementById('result');
const compressedSizeElement = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');
const newimage = document.getElementById('newimage');
const video = document.getElementById('video');
const dock = document.getElementById('dock');
const image = document.getElementById('image');

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;

    if (files.length > 0) {
        let totalSize = 0;
        for (const file of files) {
            totalSize += file.size;
        }
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
    originalSizeElement.textContent = '';
    downloadBtn.style.display = 'none';
    newimage.style.display = 'none';
    video.style.display = 'none';
    dock.style.display = 'none';
    image.style.display = 'none';


    try {
        const compressedFiles = [];
        for (const file of files) {
            const compressedFile = await imageCompression(file, options);
            compressedFiles.push(compressedFile);
        }

        resultElement.innerHTML = '';
        let totalOriginalSize = 0;
        let totalCompressedSize = 0;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                resultElement.appendChild(img);
                totalOriginalSize += files[i].size;
                totalCompressedSize += compressedFiles[i].size;
                originalSizeElement.textContent = `Размер до сжатия: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`;
                compressedSizeElement.textContent = `Сжатый размер: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`;
                newimage.style.display = 'inline';
                newimage.onclick = () => {
                    location.reload();
                };
                downloadBtn.style.display = 'inline';
                downloadBtn.onclick = () => {
                    for (let i = 0; i < compressedFiles.length; i++) {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(compressedFiles[i]);
                        a.download = `compressed_image_${i + 1}.jpg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                };
            };
            reader.readAsDataURL(compressedFiles[i]);
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