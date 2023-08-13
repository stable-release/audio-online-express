const artistService = require("./artists.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const data = await artistService.list();
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
}