// Button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    buttonStatus.forEach((button) => {
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
        if (file) uploadImagePreview.src = URL.createObjectURL(file);
        else {
            uploadImagePreview.src = "";
        }
    });
}
// Upload Image Preview END

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
    const sortSelect = document.querySelector("[sort-select]");
    const sortReset = document.querySelector("[sort-reset]");
    let url = new URL(window.location.href);

    sortSelect.addEventListener("change", (e) => {
        const [key, value] = e.target.value.split("-");
        url.searchParams.set("sortKey", key);
        url.searchParams.set("sortValue", value);
        window.location.href = url.href;
    });

    const getKey = url.searchParams.get("sortKey");
    const getValue = url.searchParams.get("sortValue");

    if (getKey && getValue) {
        let stringSort = `${getKey}-${getValue}`;
        const selected = sortSelect.querySelector(
            `option[value=${stringSort}]`
        );
        selected.selected = true;
    }

    sortReset.addEventListener("click", (e) => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });
}
// Sort End

// Logout Button
const logoutButton = document.querySelector("[logout-button]");
if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
        const confirm = window.confirm("Do you want to log out?");
        if (!confirm) {
            e.preventDefault();
        }
    });
}
// Logout Button END

// Flash Message Alert
const flashMessage = document.querySelector("[show-alert]");
if (flashMessage) {
    const dataTime = parseInt(flashMessage.getAttribute("data-time"));

    setTimeout(() => {
        flashMessage.classList.add("alert-hidden");

        // Delete
        let parent = flashMessage.parentNode;
        parent.removeChild(flashMessage);
    }, dataTime);
}
// Flash Message Alert END