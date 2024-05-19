module.exports = (req) => {
    let objectSearch = {
        keyword: ""
    };


    if (req.query.keyword) {
        objectSearch.keyword = req.query.keyword;
        objectSearch.searchCondition = {
            $or: [
                {title: new RegExp(objectSearch.keyword, "i")},
                {author: new RegExp(objectSearch.keyword, "i")}
            ]
        };
    }

    return objectSearch;
};