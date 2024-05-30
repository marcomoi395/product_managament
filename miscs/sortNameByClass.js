module.exports = (records) => {
    let result = [];

    function sortNameByClass(records, parent_id = "", level = 0) {
        records.forEach((record) => {
            if (record.parent_id === parent_id) {
                record.title = '-'.repeat(level * 4) + " " + record.title;
                result.push(record);
                sortNameByClass(records, record.id, level + 1);
            }
        });
    }

    sortNameByClass(records);
    return result;
};