/**
 * NodoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  // Mostrar nodos y versiones disponibles
  index: async function (req, res) {
    try {
      const nodos = await Nodo.find()
        .populate('version')
        .sort('createdAt DESC');

      const versiones = await VersionProceso.find()
        .populate('proceso')
        .sort('createdAt DESC');

      return res.view('admin/nodos', {
        layout: false,
        nodos,
        versiones,
          _csrf: req.csrfToken()

      });

    } catch (error) {
      sails.log.error('Error al consultar nodos:', error);
      return res.serverError();
    }
  },

  // Registrar un nodo
  crear: async function (req, res) {
    try {
      const { nombre, tipo, version } = req.body;

      // Validar nombre
      if (
        typeof nombre !== 'string' ||
        !nombre.trim() ||
        nombre.trim().length > 100
      ) {
        return res.badRequest({
          error: 'El nombre del nodo no es válido'
        });
      }

      // Validar tipo de nodo
      const tiposPermitidos = [
        'inicio',
        'condicion',
        'aprobacion',
        'fin'
      ];

      if (!tiposPermitidos.includes(tipo)) {
        return res.badRequest({
          error: 'El tipo de nodo no es válido'
        });
      }

      // Verificar que la versión exista
      const versionExistente = await VersionProceso.findOne({
        id: version
      });

      if (!versionExistente) {
        return res.badRequest({
          error: 'La versión seleccionada no existe'
        });
      }

      // No modificar versiones publicadas
      if (versionExistente.estado !== 'borrador') {
        return res.status(409).json({
          error: 'No se pueden agregar nodos a una versión publicada'
        });
      }

      // Solo puede existir un nodo Inicio por versión
      if (tipo === 'inicio') {
        const inicioExistente = await Nodo.findOne({
          version: versionExistente.id,
          tipo: 'inicio'
        });

        if (inicioExistente) {
          return res.status(409).json({
            error: 'La versión ya tiene un nodo de Inicio'
          });
        }
      }

      // Guardar el nodo
      const nodo = await Nodo.create({
        nombre: nombre.trim(),
        tipo,
        version: versionExistente.id,
        configJson: {},
        posX: 0,
        posY: 0
      }).fetch();

      return res.status(201).json({
        mensaje: 'Nodo registrado correctamente',
        nodo
      });

    } catch (error) {
      sails.log.error('Error al registrar nodo:', error);

      return res.serverError({
        error: 'No se pudo registrar el nodo'
      });
    }
  }

};

