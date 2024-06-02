// Permission
const tablePermission = document.querySelector("[table-permission]");
if (tablePermission) {
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener("click", () => {
        let permissionList = [];
        const rows = tablePermission.querySelectorAll("[name]");
        rows.forEach((row, index) => {
            const name = row.getAttribute(["name"]);
            if (name === "id") {
                const inputs = row.querySelectorAll("input");
                inputs.forEach(input => {
                    permissionList.push({ id: input.value, permission: [] });
                });
            } else {
                const inputs = row.querySelectorAll("input");
                inputs.forEach((input, index) => {
                    if (input.checked) {
                        permissionList[index].permission.push(name);
                    }
                });
            }
        });


        const formChangePermission = document.querySelector("#form-change-permission");
        const inputPermission = formChangePermission.querySelector("input");
        inputPermission.value = JSON.stringify(permissionList);
        formChangePermission.submit();
    });
}

const records = document.querySelector("[data-records]");
if (records) {
    const data = JSON.parse(records.getAttribute("data-records"));
    const rows = tablePermission.querySelectorAll("[name]");

    rows.forEach(row => {
        const inputs = row.querySelectorAll("input");
        const name = row.getAttribute("name");
        data.forEach((item, index) => {
            if (item.permission.includes(name)) {
                inputs[index].checked = true;
            }
        });
    });


}
// Permission END
