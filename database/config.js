const mongoose = require('mongoose');

const dbMongoConection = async() => {
    try {
        await mongoose.connect( process.env.DB_CONECTION );
        console.log('Data Base Conectada !');
    } catch (error) {
        console.log(error);
        throw new Error('No se pudo conectar a la Data Base');
    };
};

module.exports = dbMongoConection;