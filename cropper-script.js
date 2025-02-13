/**
 * Image Cropper Library (External JS File)
 */
const ImageCropper = {
    init: function() {
        // No need to select upload inputs anymore in plain HTML example
        // We will trigger cropping directly via a button click
    },

    setupFileUpload: function(inputId, previewId, aspectRatio) {
        // No file upload setup needed in this plain HTML example
    },

    handleFileChange: function(input, previewImg, aspectRatio) {
        // No file change handling needed in this plain HTML example
    },

    openCropperModal: function(imageSrc, aspectRatio, croppedPreviewImg) { // Modified: now accepts croppedPreviewImg
        const modal = document.createElement("div");
        modal.style.cssText = `
            position: fixed;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const cropperContainer = document.createElement("div");
        cropperContainer.style.cssText = `
            background-color: #fff;
            border-radius: 6px 6px 0 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            max-width: 60vw;
            max-height: 60vh;
        `;

        const cropperImage = document.createElement("img");
        cropperImage.src = imageSrc; // Use imageSrc directly
        cropperImage.style.cssText = `
            display: block;
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
        `;

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 10px;
            background-color: #fff;
            border-radius: 0 0 6px 6px;
            border-top: 1px solid #ddd;
            max-width: 60vw;
            margin: 0 auto;
            width: auto;
        `;

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        this.applyButtonStyle(closeButton, "#6c757d");

        const cropButton = document.createElement("button");
        cropButton.textContent = "Crop";
        this.applyButtonStyle(cropButton, "#DC3545");

        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(cropButton);

        cropperContainer.appendChild(cropperImage);
        modal.appendChild(cropperContainer);
        modal.appendChild(buttonContainer);
        document.body.appendChild(modal);

        const cropper = new Cropper(cropperImage, {
            aspectRatio: aspectRatio,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 1,
            responsive: true,
            guides: true,
            background: false,
            zoomable: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            restore: false,
            checkCrossOrigin: false,
            checkOrientation: false,
            ready: () => {
                buttonContainer.style.width = cropperContainer.offsetWidth + "px";
            }
        });

        cropButton.addEventListener("click", () => {
            this.handleCrop(cropper, croppedPreviewImg, modal); // Modified: pass croppedPreviewImg
        });

        closeButton.addEventListener("click", () => {
            document.body.removeChild(modal);
        });
    },

    handleCrop: function(cropper, croppedPreviewImg, modal) { // Modified: now accepts croppedPreviewImg
        const canvas = cropper.getCroppedCanvas();
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            croppedPreviewImg.src = url; // Update the cropped preview image directly
            croppedPreviewImg.style.display = "block"; // Show the preview image
            document.body.removeChild(modal);
        }, "image/jpeg");
    },

    applyButtonStyle: function(button, backgroundColor) {
        button.style.cssText = `
            padding: 10px 20px;
            background-color: ${backgroundColor};
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            flex: 1;
        `;
    },

    startCropping: function(imageId, aspectRatio, croppedPreviewId) { // New function to start cropping
        const image = document.getElementById(imageId);
        const croppedPreviewImg = document.getElementById(croppedPreviewId);
        if (!image || !croppedPreviewImg) {
            console.error("ImageCropper: Original image or cropped preview element not found.");
            return;
        }
        this.openCropperModal(image.src, aspectRatio, croppedPreviewImg);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const cropButton = document.getElementById('start-crop-button');
    const imageUploadInput = document.getElementById('image-upload-input');
    const originalImage = document.getElementById('original-image');
    const noImageText = document.getElementById('no-image-text');

    imageUploadInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage.src = e.target.result;
                originalImage.style.display = 'block'; // Show the image
                noImageText.style.display = 'none'; // Hide "No image selected" text
                cropButton.disabled = false; // Enable the Crop button
            }
            reader.readAsDataURL(file);
        } else {
            originalImage.src = '';
            originalImage.style.display = 'none'; // Hide image if no file
            noImageText.style.display = 'block'; // Show "No image selected" text
            cropButton.disabled = true; // Disable Crop button if no image
        }
    });


    cropButton.addEventListener('click', () => {
        ImageCropper.startCropping('original-image', 16/9, 'cropped-preview'); // Example: 16/9 aspect ratio
    });
});
