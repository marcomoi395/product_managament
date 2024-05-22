// Change Status
const status = document.querySelectorAll("[button-change-status]");
if (status) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    status.forEach((button) => {
        button.addEventListener("click", (event) => {
            let currentStatus = button.getAttribute("data-status");
            let idProduct = button.getAttribute("data-id");
            let changeStatus = currentStatus === "active" ? "inactive" : "active";

            const action = path + `/${changeStatus}/${idProduct}?_method=PATCH`;

            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
// Change Status End