const isAcceptedTerms = (value, { req }) => {
    const acceptedValue = req.body.isAccepted;
    if( acceptedValue === true ) {
        return true;
    }
    else {
        return false;
    }
};

module.exports = isAcceptedTerms;
