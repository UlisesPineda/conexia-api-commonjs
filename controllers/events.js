const { response } = require('express');
const EventModel = require('../models/EventModel.js');

const getEvent = async( req, res = response ) => {

    const eventos = await EventModel.find({ user: req.uid }).populate('user', 'user');

    try {
        return res.status(200).json({
            ok: true,
            msg: 
                eventos.length === 0 
                    ? 'No tienes actividades agendadas para este día' 
                    : 'Estas son tus actividades agendadas para este día:',
            eventos,
        });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al cargar los eventos',
        });
    }
};

const createEvent = async( req, res = response ) => {

    const event = new EventModel(req.body);

    try {
        event.user = req.uid;
        const savedEvent = await event.save();
        return res.status(201).json({
            ok: true,
            msg: 'El evento fue creado exitosamente',
            evento: savedEvent,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al crear el evento',
        });
    };
};

const editEvent = async( req, res = response ) => {

    const idEvent = req.params.id;
    const uid = req.uid;

    try {
        const event = await EventModel.findById( idEvent );
        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe',
            });
        }
        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No estás autorizado para hacer cambios',
            });
        }
        else {
            const newEvent = {
                ...req.body,
                user: uid,
            }
            const updatedEvent = await EventModel.findByIdAndUpdate( idEvent, newEvent, { new: true } );
            return res.status(200).json({
                ok: true,
                msg: 'Evento editado exitosamente',
                updatedEvent: updatedEvent,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al editar el evento',
        });
    }; 
};

const deleteEvent = async( req, res = response ) => {

    const idEvent = req.params.id;
    const uid = req.uid;

    try {
        const event = await EventModel.findById( idEvent );
        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe',
            });
        }
        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No estás autorizado para eliminar el evento',
            });
        }
        else {
            await EventModel.findByIdAndDelete( idEvent );
            return res.status(200).json({
                ok: true,
                msg: 'El evento ha sido eliminado exitosamente',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el evento',
        });
    };
};

module.exports = {
    createEvent,
    deleteEvent,
    editEvent,
    getEvent,
};
