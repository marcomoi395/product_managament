module.exports = (length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let token = "";

    for (let i = 0; i < length; i++) {
        token += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }

    return token;
};
