// GET /admin/products
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    // console.log(req);
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng",
            status: "inactive",
            class: ""
        }
    ];

    if (req.query.status) {
        const index = filterStatus.findIndex(item => item.status === req.query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status === "");
        filterStatus[index].class = "active";
    }


    // Filter status
    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }
    // Filter status END

    const products = await Product.find(find);

    res.render("admin/pages/products/index", {
        pageTitle: "Products",
        products: products,
        filterStatus: filterStatus
    });
};
