const fileInput = document.getElementById("image-input");
const image = document.getElementsByTagName("img")[0];
const imageContainer = document.getElementById("image-container");

fileInput.addEventListener('change', e => {
    const files = e.target.files;
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = e => {
        const src = e.target.result;
        image.src = src;
        imageContainer.classList.add("uploaded");
    }
    reader.readAsDataURL(files[0]);
})