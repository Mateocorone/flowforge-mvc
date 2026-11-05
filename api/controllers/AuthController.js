/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require('bcrypt');

module.exports = {

  // Mostrar pantalla de inicio de sesión
  login: async function (req, res) {
    if (req.session.usuarioId) {
      return res.redirect('/admin/procesos');
    }

    return res.view('auth/login', {
      layout: false
    });
  },

  // Verificar las credenciales
  ingresar: async function (req, res) {
    try {
      const { email, password } = req.body;

      if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
      ) {
        return res.status(400).json({
          error: 'Correo y contraseña obligatorios'
        });
      }

      const usuario = await Usuario.findOne({
        email: email.trim().toLowerCase()
      }).populate('rol');

      if (!usuario) {
        return res.status(401).json({
          error: 'Credenciales incorrectas'
        });
      }

      // El hash protegido se necesita para verificar.
      const usuarioConHash = await Usuario.findOne({
        id: usuario.id
      }).decrypt();

      const contraseñaCorrecta = await bcrypt.compare(
        password,
        usuarioConHash.passwordHash
      );

      if (!contraseñaCorrecta) {
        return res.status(401).json({
          error: 'Credenciales incorrectas'
        });
      }

      // Regenerar la sesión al autenticar
      await new Promise((resolve, reject) => {
        req.session.regenerate(error => {
          if (error) return reject(error);
          resolve();
        });
      });

      req.session.usuarioId = usuario.id;
      req.session.rol = usuario.rol.nombre;

      return res.json({
        mensaje: 'Sesión iniciada correctamente',
        redireccion: '/admin/procesos'
      });

    } catch (error) {
      sails.log.error('Error de autenticación:', error);

      return res.status(500).json({
        error: 'No se pudo iniciar sesión'
      });
    }
  },

  // Cerrar sesión
  salir: async function (req, res) {
    req.session.destroy(error => {
      if (error) {
        sails.log.error(error);
        return res.serverError();
      }

      return res.redirect('/login');
    });
  }

};

