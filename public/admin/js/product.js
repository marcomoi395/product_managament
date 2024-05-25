// Change Status
const status = document.querySelectorAll("[button-change-status]");
if (status.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    status.forEach((button) => {
        button.addEventListener("click", (event) => {
            let currentStatus = button.getAttribute("data-status");
            let idProduct = button.getAttribute("data-id");
            let changeStatus = currentStatus === "active" ? "inactive" : "active";

            formChangeStatus.action = path + `/${changeStatus}/${idProduct}?_method=PATCH`;
            formChangeStatus.submit();
        });
    });
}
// Change Status End

// Check Box All
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
    const checkBoxId = document.querySelectorAll('[name="check-id"]');
    const checkBoxAll = document.querySelector('[name="checkall"]');
    checkBoxAll.addEventListener("click", () => {
        if (checkBoxAll.checked)
            checkBoxId.forEach((e) => {
                e.checked = true;
            });
        else {
            checkBoxId.forEach((e) => {
                e.checked = false;
            });
        }
    });


    checkBoxId.forEach((e) => {
        e.addEventListener("click", () => {
            const countCheckTrue = document.querySelectorAll('[name="check-id"]:checked').length;
            checkBoxAll.checked = checkBoxId.length === countCheckTrue;
        });
    });
}
// Check Box All END

// Form Change Multi
const formChangeStatusMulti = document.querySelector("[form-change-status-multi]");
if (formChangeStatusMulti) {
    formChangeStatusMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkBoxChecked = checkBoxMulti.querySelectorAll('input[name="check-id"]:checked');
        const inputIds = document.querySelector('[name="ids"]');
        const statusSelect = document.querySelector('[name="type"]');
        if (statusSelect.value === "delete") {
            const isConfirm = window.confirm("Bạn có chắc là muốn xóa không???");
            if (!isConfirm) {
                return;
            }
        }

        if (statusSelect.value === "restore") {
            const isConfirm = window.confirm("Bạn có chắc là muốn khôi phục không???");
            if (!isConfirm) {
                return;
            }
        }

        if (checkBoxChecked.length > 0 && statusSelect.value !== "Select") {
            let ids = [];
            checkBoxChecked.forEach((e) => {
                ids.push(e.value);
            });
            inputIds.value = ids.join(", ");
            formChangeStatusMulti.submit();
        } else if (statusSelect.value === "Select") {
            alert("Select the appropriate status");
        } else
            alert("Select at least one product");
    });
}
// Form Change Multi End

// Delete Product
const deleteProduct = document.querySelectorAll("[button-delete-product]");

if (deleteProduct.length > 0) {
    const formDeleteProduct = document.querySelector("#form-delete-product");
    const path = formDeleteProduct.getAttribute("data-path");

    deleteProduct.forEach(button => {
        button.addEventListener("click", (event) => {
            let isConfirm = window.confirm("Bạn có chắc là muốn xóa không???");
            if (isConfirm) {
                let idProduct = button.getAttribute("data-id");

                formDeleteProduct.action = path + `/${idProduct}?_method=PATCH`;
                formDeleteProduct.submit();
            }
        });
    });
}
// Delete Product End

