const { response } = require('express');

const ContactModel = require("../models/ContactModel.js");
const formatPhone = require('../helpers/formatPhone.js');
const cleanName = require('../helpers/cleanName.js');

const getContacts = async( req, res = response ) => {
    
    try {
        const contactos = await ContactModel.find({ user: req.uid }).sort({ _id: -1 }).limit(3);
        return res.status(200).json({
            ok: true,
            msg: 'Tus últimos contactos agregados:',
            contactos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al cargar la información de tus contactos'
        });
    }
};

const getQueryContact = async( req, res = response ) => {

    const { query } = req.body;
    const cleanQuery = cleanName( query );

    try {
        const contactos = await ContactModel.find({
                user: req.uid,
                $or: [
                    {name: new RegExp(cleanQuery, 'i')},
                    {phoneOne: new RegExp(cleanQuery, 'i')}, 
                    {phoneTwo: new RegExp(cleanQuery, 'i')}, 
                    {emailOne: new RegExp(cleanQuery, 'i')}, 
                    {emailTwo: new RegExp(cleanQuery, 'i')}, 
                ]
            });    
        if( contactos.length === 0 ){
            res.status(404).json({
                ok: false,
                msg: `No se encontraron contactos con el término: ${ query }`,
            });
        }
        else {
            res.status(200).json({
                ok: true,
                msg: `Contactos encontrados con el término de busqueda: ${ query }`,
                contactos
            });        
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al hacer la búsqueda, intenta más tarde',
        });     
    }
};

const createContact = async( req, res = response ) => {

    const { cleanPhoneNumber } = formatPhone();
    const { emailOne } = req.body;
    
    try {
        const prevContact = await ContactModel.findOne({ user: req.uid, emailOne});

        if( prevContact ){
            return res.status(400).json({
                ok: false,
                exist: true,
                message: `El contacto con el correo: ${ emailOne } ya existe`,
            });
        }
        else {
            const contact = new ContactModel( req.body );
            contact.user = req.uid;
            contact.name = cleanName( contact.name );
            contact.phoneOne = cleanPhoneNumber( contact.phoneOne );
            contact.phoneTwo = cleanPhoneNumber( contact.phoneTwo );
            const savedContact = await contact.save();
            return res.status(201).json({
                ok: true,
                msg: 'El contacto fue creado exitosamente',
                contacto: savedContact,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al intentar crear el contacto',
        });     
    }
};

const editContact = async( req, res = response) => {

    const idContact = req.params.id;
    const uid = req.uid;
    
    try {
        const contact = await ContactModel.findById( idContact );
        const cleanedName = cleanName( contact.name );
        if( !contact ) {
            return res.status(404).json({
                ok: false,
                msg: 'El contacto no existe',
            });
        }
        if( contact.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No estás autorizado para editar este contacto',
            });
        }
        else {
            const newContact = {
                ...req.body,
                name: cleanedName,
                user: uid,
            };
            const updatedContact = await ContactModel.findByIdAndUpdate( idContact, newContact, { new: true } );
            return res.status(200).json({
                ok: true,
                msg: 'Contacto editado exitosamente',
                updatedContact: updatedContact,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al editar el evento',
        });
    }
};

const deleteContact = async( req, res = response ) => {

    const idContact = req.params.id;
    const uid = req.uid;

    try {
        const contact = await ContactModel.findById( idContact );
        if( !contact ) {
            return res.status(404).json({
                ok: false,
                msg: 'El contacto no existe',
            });
        }
        if( contact.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No estás autorizado para eliminar este contacto',
            });
        }
        else {
            await ContactModel.findByIdAndDelete( idContact );
            return res.status(200).json({
                ok: true,
                msg: 'El contacto ha sido eliminado exitosamente',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el contacto',
        });
    }
};

module.exports = {
    getContacts,
    getQueryContact,
    createContact,
    editContact,
    deleteContact,
};
