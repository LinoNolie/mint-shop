const startCamera = document.getElementById('startCamera');
const uploadPhoto = document.getElementById('uploadPhoto');
const photoUpload = document.getElementById('photoUpload');
const dropZone = document.getElementById('dropZone');
const cameraPreview = document.getElementById('cameraPreview');
const previewCanvas = document.getElementById('previewCanvas');
const generateButton = document.getElementById('generateImage');

// Camera handling
startCamera.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraPreview.srcObject = stream;
        cameraPreview.style.display = 'block';
        dropZone.style.display = 'none';
        takePhotoButton.style.display = 'block';
    } catch (err) {
        console.error('Error accessing camera:', err);
    }
});

// File upload handling
uploadPhoto.addEventListener('click', () => {
    photoUpload.click();
});

photoUpload.addEventListener('change', handleFileSelect);
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--accent)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

function handleFileSelect(e) {
    handleFiles(e.target.files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            // Process image and show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    previewCanvas.width = img.width;
                    previewCanvas.height = img.height;
                    const ctx = previewCanvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    previewCanvas.style.display = 'block';
                    dropZone.style.display = 'none';
                    generateButton.style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}

// Add snapshot functionality
const takePhotoButton = document.createElement('button');
takePhotoButton.className = 'btn';
takePhotoButton.textContent = 'Take Photo';
takePhotoButton.style.display = 'none';

cameraPreview.parentNode.insertBefore(takePhotoButton, generateButton);

takePhotoButton.addEventListener('click', () => {
    const context = previewCanvas.getContext('2d');
    previewCanvas.width = cameraPreview.videoWidth;
    previewCanvas.height = cameraPreview.videoHeight;
    context.drawImage(cameraPreview, 0, 0, previewCanvas.width, previewCanvas.height);
    
    previewCanvas.style.display = 'block';
    cameraPreview.style.display = 'none';
    takePhotoButton.style.display = 'none';
    generateButton.style.display = 'block';
});

// Update API integration to use backend
async function generateAIPreview(imageData) {
    try {
        const response = await fetch('http://localhost:3000/api/generate-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageData
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error('Error generating preview:', error);
        throw error;
    }
}

function showLoading() {
    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoading() {
    const loader = document.querySelector('.loading-container');
    if (loader) {
        loader.remove();
    }
}

// Update generate button click handler
generateButton.addEventListener('click', async () => {
    try {
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';
        showLoading();

        const imageData = previewCanvas.toDataURL('image/jpeg').split(',')[1];
        const resultImageUrl = await generateAIPreview(imageData);

        // Display the result
        const resultImage = new Image();
        resultImage.src = resultImageUrl;
        resultImage.onload = () => {
            const context = previewCanvas.getContext('2d');
            context.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            context.drawImage(resultImage, 0, 0, previewCanvas.width, previewCanvas.height);
        };
    } catch (error) {
        alert('Error generating preview: ' + error.message);
    } finally {
        hideLoading();
        generateButton.disabled = false;
        generateButton.textContent = 'Generate Preview';
    }
});