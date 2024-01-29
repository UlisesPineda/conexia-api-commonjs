const { Router } = require("express");
const { check } = require("express-validator");

const validateJWT = require("../middlewares/validateJWT.js");
const validateInput = require("../middlewares/validateInput.js");
const { createContact, deleteContact, editContact, getContacts, getQueryContact } = require("../controllers/contacts.js");

const contactsRouter = Router();
module.exports = contactsRouter;

// export const contactsRouter = Router();

contactsRouter.use( validateJWT );

contactsRouter.get('/', getContacts );
contactsRouter.post('/search', getQueryContact );
contactsRouter.post(
    '/',
    [
        check('name', 'El nombre del contacto es obligatorio').not().isEmpty(),
        check('phoneOne', 'Debes ingresar al menos un número telefónico').not().isEmpty(),
        check('emailOne', 'Debes ingresar al menos un correo electrónico').not().isEmpty(),
        validateInput,
    ],
    createContact,
);
contactsRouter.put(
    '/:id',
    [
        check('name', 'El nombre del contacto es obligatorio').not().isEmpty(),
        check('phoneOne', 'Debes ingresar al menos un número telefónico').not().isEmpty(),
        check('emailOne', 'Debes ingresar al menos un correo electrónico').not().isEmpty(),
        validateInput,
    ],
    editContact
);
contactsRouter.delete('/:id', deleteContact );