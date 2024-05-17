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