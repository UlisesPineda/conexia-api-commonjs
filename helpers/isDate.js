const isDate = ( value, { req } ) => {
    var fecha = new Date(req.body.date);

    if (!isNaN(fecha.getTime())) {
        return true;
    } else {
        console.log("Fecha no válida");
        return false;
    }
};

module.exports = isDate;
