/**
 * Nodo.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombre:{
      type: 'string',
      required: true,
      maxLength: 100
    },

    tipo: {
      type: 'string',
      required: true,
      isIn: [
        'inicio',
        'condicion',
        'aprobacion',
        'fin'
      ]
    },

    configJson: {
      type: 'json',
      defaultsTo: {}
    },

    posX: {
      type: 'number',
      defaultsTo: 0
    },

    posY: {
      type: 'number',
      defaultsTo: 0
    },

    version: {
      model: 'versionproceso',
      required: true
    },

    transicionesSalida:{
      collection: 'transicion',
      via: 'origen'
    },

    transicionesEntrada:{
      collection: 'transicion',
      via: 'destino'
    }

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

