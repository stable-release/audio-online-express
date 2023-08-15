const artistService = require("./artists.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
    "artist_id",
    "artist_name",
    "artist_location",
    "artist_notes",
];

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;

    const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
    );

    if (invalidFields.length) return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
    next();
}

async function artistExists(req, res, next) {
    const { artist_id } = req.body.data;
    const { artistId } = await artistService.read(artist_id);
    if (artistId) {
        res.locals.artistId = artistId;
        return next();
    }
    next({
        status: 404,
        message: `Artist ID: ${artist_id} cannot be found`,
    });
}

async function list(req, res) {
    const data = await artistService.list();
    res.json({ data });
}

async function read(req, res) {
    const data = await artistService.read(res.locals.artistId);
    res.json({ data });
}

async function readArtistName(req, res) {
    const data = await artistService.findArtist(req.body.data.artist_name);
    res.json({ data });
}

module.exports = {
    read: [asyncErrorBoundary(artistExists), asyncErrorBoundary(read)],
    readByName: [ asyncErrorBoundary(readArtistName)],
    list: asyncErrorBoundary(list),
}