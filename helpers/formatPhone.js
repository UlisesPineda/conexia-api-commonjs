
const formatPhone = () => {

    const cleanPhoneNumber = ( phone ) => {
        let cleanPhone
        if( phone !== '' ){
            cleanPhone = phone.replace(/\s/g, "");
        }
        else{
            cleanPhone = ''
        };
        return cleanPhone;
    };

    return {
        cleanPhoneNumber,
    };
};

module.exports = formatPhone;
