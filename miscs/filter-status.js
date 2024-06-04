module.exports = (req) => {
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: "",
        },
        {
            name: "Active",
            status: "active",
            class: "",
        },
        {
            name: "Inactive",
            status: "inactive",
            class: "",
        },
        {
            name: "Featured",
            status: "featured",
            class: "",
        },
    ];

    if (req.query.status) {
        const index = filterStatus.findIndex(
            (item) => item.status === req.query.status,
        );
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex((item) => item.status === "");
        filterStatus[index].class = "active";
    }
    return filterStatus;
};
