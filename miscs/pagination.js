module.exports = async (req, Product, find) => {
    let objectPagination = {
        currentPageNumber: 1,
        numberOfProductsPerPage: 10
    };

    if (req.query.page) {
        objectPagination.currentPageNumber = parseInt(req.query.page);
    }

    objectPagination.skip = (objectPagination.currentPageNumber - 1) * objectPagination.numberOfProductsPerPage;
    objectPagination.numberOfPage = Math.ceil(await Product.find(find).count() / objectPagination.numberOfProductsPerPage);
    return objectPagination;
};