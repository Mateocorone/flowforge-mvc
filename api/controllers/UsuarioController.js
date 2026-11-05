
const bcrypt = require('bcrypt');

module.exports = {

  index: async function (req, res) {

    const usuarios = await Usuario.find()
      .populate('rol');

    const roles = await Rol.find()
      .sort('nombre ASC');

    return res.view('admin/usuarios', {
      layout: false,
      usuarios,
      roles,
      _csrf: req.csrfToken()
    });
  },

  crear: async function (req, res) {

    try {
      const { nombre, email, password, rol } = req.body;

      // 1. Validar campos obligatorios
      if (
        typeof nombre !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !nombre.trim() ||
        !email.trim() ||
        !password ||
        !rol
      ) {
        return res.badRequest({
          error: 'Todos los campos son obligatorios'
        });
      }

      // 2. Validar el correo en el servidor
      const correo = email.trim().toLowerCase();

      const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

      if (!emailValido || correo.length > 150) {
        return res.badRequest({
          error: 'El correo electrónico no es válido'
        });
      }

      // 3. Validar la contraseña
      if (password.length < 8 || password.length > 72) {
        return res.badRequest({
          error: 'La contraseña debe tener entre 8 y 72 caracteres'
        });
      }

      // 4. Comprobar si el correo ya está registrado
      const existente = await Usuario.findOne({
        email: correo
      });

      if (existente) {
        return res.status(409).json({
          error: 'El correo ya está registrado'
        });
      }

      // 5. Verificar que el rol exista
      const rolExistente = await Rol.findOne({
        id: rol
      });

      if (!rolExistente) {
        return res.badRequest({
          error: 'El rol seleccionado no existe'
        });
      }

      // 6. Generar hash de contraseña
      const passwordHash = await bcrypt.hash(password, 12);

      // 7. Guardar usuario
      await Usuario.create({
        nombre: nombre.trim(),
        email: correo,
        passwordHash,
        rol: rolExistente.id
      });

      return res.status(201).json({
        mensaje: 'Usuario registrado correctamente'
      });

    } catch (error) {

      sails.log.error('Error al registrar usuario:', error);

      if (error.code === 'E_UNIQUE') {
        return res.status(409).json({
          error: 'El correo ya está registrado'
        });
      }

      return res.serverError({
        error: 'No se pudo registrar el usuario'
      });
    }
  }

};
