/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': true,

  // Administración de usuarios
  'usuario/index': 'esAdministrador',
  'usuario/crear': 'esAdministrador',

  // Administración de procesos
  'proceso/index': 'esAdministrador',
  'proceso/crear': 'esAdministrador',

  // Administración de versiones
  'versionproceso/index': 'esAdministrador',
  'versionproceso/crear': 'esAdministrador',

  // Administración de nodos
  'nodo/index': 'esAdministrador',
  'nodo/crear': 'esAdministrador',

  // Administración de transiciones
  'transicion/index': 'esAdministrador',
  'transicion/crear': 'esAdministrador'

};
