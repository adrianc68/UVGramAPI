const createURL = (encrypted, address, port) => {
    let data = `http${(encrypted ? "s" : "")}://${address}:${port}`;
    return data;
}

module.exports = createURL