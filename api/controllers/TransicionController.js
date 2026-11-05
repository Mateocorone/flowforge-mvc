/**
 * TransicionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  // Mostrar transiciones y datos para los dropdowns
  index: async function (req, res) {
    try {
      const transiciones = await Transicion.find()
        .populate('origen')
        .populate('destino')
        .populate('version');

      const versiones = await VersionProceso.find()
        .populate('proceso');

      const nodos = await Nodo.find();

      return res.view('admin/transiciones', {
        layout: false,
        transiciones,
        versiones,
        nodos,
          _csrf: req.csrfToken()

      });

    } catch (error) {
      sails.log.error('Error al consultar transiciones:', error);
      return res.serverError();
    }
  },

  // Crear una transición entre dos nodos
  crear: async function (req, res) {
    try {
      const {
        nombre,
        version,
        origen,
        destino
      } = req.body;

      // 1. Validar el nombre
      if (
        typeof nombre !== 'string' ||
        !nombre.trim() ||
        nombre.trim().length > 100
      ) {
        return res.status(400).json({
          error: 'El nombre no es válido'
        });
      }

      // 2. Validar que se hayan seleccionado IDs
      if (!version || !origen || !destino) {
        return res.status(400).json({
          error: 'Selecciona versión, origen y destino'
        });
      }

      // 3. Consultar los registros reales
      const versionDB = await VersionProceso.findOne({
        id: version
      });

      const origenDB = await Nodo.findOne({
        id: origen
      });

      const destinoDB = await Nodo.findOne({
        id: destino
      });

      if (!versionDB || !origenDB || !destinoDB) {
        return res.status(400).json({
          error: 'Versión o nodos inexistentes'
        });
      }

      // 4. Impedir modificar versiones publicadas
      if (versionDB.estado !== 'borrador') {
        return res.status(409).json({
          error: 'La versión ya está publicada'
        });
      }

      // 5. Validación principal del core
      if (
        String(origenDB.version) !== String(versionDB.id) ||
        String(destinoDB.version) !== String(versionDB.id)
      ) {
        return res.status(400).json({
          error: 'Los nodos deben pertenecer a la misma versión'
        });
      }

      // 6. No permitir un nodo conectado consigo mismo
      if (String(origenDB.id) === String(destinoDB.id)) {
        return res.status(400).json({
          error: 'Origen y destino deben ser diferentes'
        });
      }

      // 7. No permitir salir de un nodo Fin
      if (origenDB.tipo === 'fin') {
        return res.status(400).json({
          error: 'Un nodo Fin no puede tener salidas'
        });
      }

      // 8. No permitir llegar a un nodo Inicio
      if (destinoDB.tipo === 'inicio') {
        return res.status(400).json({
          error: 'Un nodo Inicio no puede tener entradas'
        });
      }

      // 9. Evitar conexiones duplicadas
      const existente = await Transicion.findOne({
        version: versionDB.id,
        origen: origenDB.id,
        destino: destinoDB.id
      });

      if (existente) {
        return res.status(409).json({
          error: 'Esta conexión ya existe'
        });
      }

      // 10. Guardar
      const transicion = await Transicion.create({
        nombre: nombre.trim(),
        version: versionDB.id,
        origen: origenDB.id,
        destino: destinoDB.id,
        condicionJson: {},
        prioridad: 1
      }).fetch();

      return res.status(201).json({
        mensaje: 'Transición registrada correctamente',
        transicion
      });

    } catch (error) {
      sails.log.error('Error al crear transición:', error);

      return res.status(500).json({
        error: 'No se pudo crear la transición'
      });
    }
  }

};

