const { Schema, model } = require("mongoose");

const SchemaUser = Schema({
    user: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    enterprise: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isDark: {
        type: Boolean,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    isSuspended:{
        type: Boolean,
        required: true,
    },
    isAccepted: {
        type: Boolean,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
});

module.exports = model('Usuario', SchemaUser);

