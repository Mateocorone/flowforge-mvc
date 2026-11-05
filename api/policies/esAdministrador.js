
module.exports = async function (req, res, proceed) {

  // Verificar que exista una sesión
  if (!req.session || !req.session.usuarioId) {
    if (req.method === 'GET') {
      return res.redirect('/login');
    }

    return res.status(401).json({
      error: 'Debes iniciar sesión'
    });
  }

  try {
    // Verificar el usuario y su rol en la base de datos
    const usuario = await Usuario.findOne({
      id: req.session.usuarioId
    }).populate('rol');

    if (!usuario || !usuario.rol ||
        usuario.rol.nombre !== 'Administrador') {
      return res.status(403).json({
        error: 'Acceso exclusivo para administradores'
      });
    }

    // Autorizado: continuar al controlador
    return proceed();

  } catch (error) {
    sails.log.error('Error de autorización:', error);

    return res.status(500).json({
      error: 'No se pudo verificar el acceso'
    });
  }
};
