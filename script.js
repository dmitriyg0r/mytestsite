document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        fileInput: document.getElementById('fileInput'),
        compressBtn: document.getElementById('compressBtn'),
        originalSize: document.getElementById('originalSize'),
        preview: document.getElementById('preview'),
        progressBar: document.getElementById('progressBar'),
        loading: document.getElementById('loading'),
        result: document.getElementById('result'),
        compressedSize: document.getElementById('compressedSize'),
        downloadBtn: document.getElementById('downloadBtn'),
        newimage: document.getElementById('newimage'),
        videoButton: document.getElementById('video'),
        dockButton: document.getElementById('dock'),
        imageButton: document.getElementById('image'),
        imageContainer: document.getElementById('imageContainer'),
        documentContainer: document.getElementById('documentContainer')
    };

    const showContainer = (container) => {
        elements.imageContainer.style.display = 'none';
        elements.documentContainer.style.display = 'none';
        container.style.display = 'block';
    };

    const updateProgressBar = (progress) => {
        elements.progressBar.style.width = `${progress}%`;
        elements.progressBar.textContent = `${progress}%`;
    };

    elements.videoButton.addEventListener('click', () => {
        alert('Сжатие видео еще не реализовано');
    });

    elements.dockButton.addEventListener('click', () => {
        showContainer(elements.documentContainer);
    });

    elements.imageButton.addEventListener('click', () => {
        showContainer(elements.imageContainer);
    });

    elements.fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        elements.preview.innerHTML = '';
        if (files.length > 0) {
            elements.originalSize.textContent = `Выбрано изображений: ${files.length}`;
            elements.compressBtn.style.display = 'inline';

            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    elements.preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        } else {
            elements.originalSize.textContent = '';
            elements.compressBtn.style.display = 'none';
        }
    });

    elements.compressBtn.addEventListener('click', async () => {
        const files = elements.fileInput.files;
        if (files.length === 0) {
            alert('Выберите файлы изображений');
            return;
        }

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            onProgress: updateProgressBar
        };

        elements.progressBar.style.display = 'block';
        elements.compressBtn.style.display = 'none';
        elements.loading.style.display = 'inline-block';
        elements.result.innerHTML = '';
        elements.compressedSize.textContent = '';
        elements.downloadBtn.style.display = 'none';
        elements.newimage.style.display = 'none';

        try {
            const compressedFiles = await Promise.all(Array.from(files).map(file => imageCompression(file, options)));

            let totalOriginalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
            let totalCompressedSize = compressedFiles.reduce((acc, file) => acc + file.size, 0);

            elements.originalSize.textContent = `Размер до сжатия: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`;
            elements.compressedSize.textContent = `Сжатый размер: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`;

            compressedFiles.forEach((file, i) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    elements.result.appendChild(img);
                };
                reader.readAsDataURL(file);
            });

            elements.newimage.style.display = 'inline';
            elements.newimage.onclick = () => location.reload();

            elements.downloadBtn.style.display = 'inline';
            elements.downloadBtn.onclick = () => {
                compressedFiles.forEach((file, i) => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(file);
                    a.download = `compressed_image_${i + 1}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            };

        } catch (error) {
            console.error('Ошибка при сжатии изображений:', error);
            alert('Ошибка при сжатии изображений. Попробуйте еще раз.');
        } finally {
            elements.loading.style.display = 'none';
            elements.progressBar.style.display = 'none';
            elements.compressBtn.style.display = 'inline';
        }
    });
});
