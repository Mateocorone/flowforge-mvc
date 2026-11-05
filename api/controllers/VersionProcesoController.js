/**
 * VersionProcesoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  // Mostrar versiones y procesos disponibles
  index: async function (req, res) {
    try {
      const versiones = await VersionProceso.find()
        .populate('proceso')
        .sort('createdAt DESC');

      const procesos = await Proceso.find()
        .sort('nombre ASC');

      return res.view('admin/versiones', {
        layout: false,
        versiones,
        procesos,
        _csrf: req.csrfToken()
      });

    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },

  // Crear una versión en estado borrador
  crear: async function (req, res) {
    try {
      const { numero, proceso } = req.body;

      const numeroVersion = Number(numero);

      // Validación en el Back-End
      if (
        !Number.isSafeInteger(numeroVersion) ||
        numeroVersion < 1 ||
        !proceso
      ) {
        return res.badRequest({
          error: 'Número de versión o proceso inválido'
        });
      }

      // Comprobar que el proceso existe
      const procesoExistente = await Proceso.findOne({
        id: proceso
      });

      if (!procesoExistente) {
        return res.badRequest({
          error: 'El proceso seleccionado no existe'
        });
      }

      // Evitar duplicar el número dentro del mismo proceso
      const duplicada = await VersionProceso.findOne({
        proceso: procesoExistente.id,
        numero: numeroVersion
      });

      if (duplicada) {
        return res.status(409).json({
          error: 'Esta versión ya existe para el proceso'
        });
      }

      const version = await VersionProceso.create({
        numero: numeroVersion,
        proceso: procesoExistente.id,
        estado: 'borrador'
      }).fetch();

      return res.status(201).json({
        mensaje: 'Versión creada correctamente',
        version
      });

    } catch (error) {
      sails.log.error('Error creando versión:', error);

      return res.serverError({
        error: 'No se pudo crear la versión'
      });
    }
  }

};

