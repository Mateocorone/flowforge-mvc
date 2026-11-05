/**
 * ProcesoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  // Mostrar administración de procesos
  index: async function (req, res) {
    try {
      const procesos = await Proceso.find()
        .populate('creador');

      const usuarios = await Usuario.find()
        .sort('nombre ASC');

      return res.view('admin/procesos', {
        layout: false,
        procesos,
        usuarios,
        _csrf: req.csrfToken()
      });

    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },

  // Registrar un nuevo proceso
  crear: async function (req, res) {
    try {
      const { nombre, descripcion, creador } = req.body;

      // Validar datos obligatorios en Back-End
      if (
        typeof nombre !== 'string' ||
        !nombre.trim() ||
        nombre.trim().length > 100 ||
        !creador
      ) {
        return res.badRequest({
          error: 'Nombre y creador válidos son obligatorios'
        });
      }

      // Verificar que el usuario seleccionado exista
      const usuario = await Usuario.findOne({
        id: creador
      });

      if (!usuario) {
        return res.badRequest({
          error: 'El usuario seleccionado no existe'
        });
      }

      const proceso = await Proceso.create({
        nombre: nombre.trim(),
        descripcion:
          typeof descripcion === 'string'
            ? descripcion.trim()
            : '',
        creador: usuario.id
      }).fetch();

      return res.status(201).json({
        mensaje: 'Proceso registrado correctamente',
        proceso
      });

    } catch (error) {
      sails.log.error('Error al crear proceso:', error);

      return res.serverError({
        error: 'No se pudo crear el proceso'
      });
    }
  }

};

