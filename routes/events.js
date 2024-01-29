const { Router } = require('express'); 
const { check } = require("express-validator");

const { createEvent, deleteEvent, editEvent, getEvent } = require("../controllers/events.js");
const validateJWT = require("../middlewares/validateJWT.js");
const validateInput = require("../middlewares/validateInput.js");
const isDate = require("../helpers/isDate.js");

const eventsRouter = Router();
module.exports = eventsRouter;

eventsRouter.use( validateJWT );

eventsRouter.get('/', getEvent);
eventsRouter.post(
    '/', 
    [
        check('title', 'El nombre de la actividad es obligatoria').not().isEmpty(),
        check('date', 'La fecha es obligatoria').custom( isDate ),
        validateInput,
    ], 
    createEvent
);
eventsRouter.put('/:id', editEvent);
eventsRouter.delete('/:id', deleteEvent);
