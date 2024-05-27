// Button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus) {
    buttonStatus.forEach(button => {
        let url = new URL(window.location.href);

        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            url.searchParams.delete("page");

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}
// Button status END

//Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        let keyword = event.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}
//Form Search END

//Pagination
const pagination = document.querySelectorAll("[button-pagination]");
if (pagination) {
    pagination.forEach((button) => {
        button.addEventListener("click", (event) => {
            let url = new URL(window.location.href);
            let number = button.getAttribute("button-pagination");

            url.searchParams.set("page", number);

            window.location.href = url.href;
        });
    });
}
//Pagination END

// Upload Image Preview
const formUploadImage = document.querySelector("[upload-image]");
if (formUploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (e) => {
        const [file] = uploadImageInput.files;
        if (file)
            uploadImagePreview.src = URL.createObjectURL(file);
        else {
            uploadImagePreview.src = "";
        }
    });
}

// Upload Image Preview END

