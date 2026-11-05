/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  const rolesIniciales = [

    {
      nombre: 'Administrador',
      descripcion: 'Gestiona usuarios y procesos'
    },
    {
      nombre: 'Solicitante',
      descripcion: 'Inicia solicitudes empresariales'
    },
    {
      nombre: 'Aprobador',
      descripcion: 'Aprueba o rechaza solicitudes'
    }

  ];

  for (const rol of rolesIniciales) {

    const existente = await Rol.findOne({
      nombre: rol.nombre
    });

    if (!existente) {
      await Rol.create(rol);

      sails.log.info(
        'Rol creado: ' + rol.nombre
      );
    }
  }


  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

};
