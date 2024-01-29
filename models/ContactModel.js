const { Schema, model } = require("mongoose");

const SchemaContact = Schema({
    name: {
        type: String,
        required: true,
    },
    phoneOne: {
        type: String,
        required: true,
    },
    phoneTwo: {
        type: String,
    },
    emailOne: {
        type: String,
        required: true,
    },
    emailTwo: {
        type: String,
    },
    adress: {
        type: String,
    },
    notes: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
});

module.exports = model('Contacto', SchemaContact);
