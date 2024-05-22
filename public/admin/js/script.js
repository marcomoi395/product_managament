// button-status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus) {
    buttonStatus.forEach(button => {
        let url = new URL(window.location.href);

        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}
// button-status END

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

