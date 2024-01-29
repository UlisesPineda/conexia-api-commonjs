const cleanName = ( name ) => {
    let cleanName;
    const firstClean = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cleanName = firstClean.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    return cleanName;
};

module.exports = cleanName;
