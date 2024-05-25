// Restore Product
const recycleBin = document.querySelectorAll("[button-restore-product]");
console.log(recycleBin);
if (recycleBin.length > 0) {
    const formRestoreProduct = document.querySelector("#form-restore-product");
    const path = formRestoreProduct.getAttribute("data-path");

    recycleBin.forEach(button => {
        button.addEventListener("click", (event) => {
            let isConfirm = window.confirm("Bạn có chắc là muốn khôi phục lại không???");
            if (isConfirm) {
                let idProduct = button.getAttribute("data-id");

                const action = path + `/${idProduct}?_method=PATCH`;

                formRestoreProduct.action = action;
                formRestoreProduct.submit();
            }
        });
    });
}
// Restore Product END