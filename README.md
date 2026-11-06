# flowforge-mvc

a [Sails v1](https://sailsjs.com) application


### Links

+ [Sails framework documentation](https://sailsjs.com/get-started)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Thu Nov 05 2026 10:50:09 GMT-0500 (Ecuador Time) using Sails v1.5.18.

# FlowForge MVC

**Sistema de administración de flujos de trabajo empresariales**

Proyecto académico desarrollado para la asignatura Ingeniería Web de la Universidad de Las Américas (UDLA).

## 1. Descripción

FlowForge es una aplicación web orientada a la administración de procesos empresariales y a la configuración de sus flujos de trabajo.

Permite gestionar usuarios, roles, procesos, versiones, nodos y transiciones mediante una interfaz web.

El proyecto utiliza el patrón arquitectónico **Modelo-Vista-Controlador (MVC)**, implementado con Sails.js.

**Alcance actual:** administración y configuración de flujos de trabajo. El motor de ejecución de procesos se contempla como una funcionalidad posterior.

## 2. Tecnologías utilizadas

| Tecnología | Propósito |
|---|---|
| Node.js | Entorno de ejecución |
| Sails.js 1.5.18 | Framework Back-End MVC |
| JavaScript | Lenguaje de programación |
| EJS | Plantillas para las vistas |
| Bootstrap | Interfaz web |
| Waterline ORM | Persistencia y relaciones entre modelos |
| bcrypt | Protección de contraseñas |
| Git y GitHub | Control de versiones |

## 3. Arquitectura MVC

El proyecto está organizado en tres componentes principales:

- **Modelos:** definen las entidades y sus relaciones mediante Waterline ORM.
- **Vistas:** presentan formularios y tablas de administración utilizando EJS y Bootstrap.
- **Controladores:** procesan solicitudes HTTP, realizan validaciones y coordinan las operaciones de los modelos.

### Estructura del proyecto

```text
flowforge-mvc/
├── api/
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UsuarioController.js
│   │   ├── ProcesoController.js
│   │   ├── VersionProcesoController.js
│   │   ├── NodoController.js
│   │   └── TransicionController.js
│   ├── models/
│   │   ├── Rol.js
│   │   ├── Usuario.js
│   │   ├── Proceso.js
│   │   ├── VersionProceso.js
│   │   ├── Nodo.js
│   │   └── Transicion.js
│   └── policies/
│       └── esAdministrador.js
├── config/
│   ├── bootstrap.js
│   ├── policies.js
│   └── routes.js
├── views/
│   ├── admin/
│   └── auth/
├── package.json
└── README.md
```

## 4. Entidades del sistema

| Entidad | Descripción |
|---|---|
| Rol | Define los permisos asociados a cada tipo de usuario |
| Usuario | Almacena los datos de acceso y el rol asignado |
| Proceso | Representa un proceso empresarial configurable |
| VersionProceso | Administra las versiones de un proceso |
| Nodo | Representa una etapa de un flujo de trabajo |
| Transicion | Establece las conexiones entre nodos |

### Relaciones

- Un rol puede asociarse con múltiples usuarios.
- Un usuario puede ser creador de procesos.
- Un proceso puede contener múltiples versiones.
- Una versión contiene nodos y transiciones.
- Cada transición conecta un nodo de origen con uno de destino.

Las relaciones se seleccionan desde listas desplegables en los formularios administrativos, evitando el ingreso manual de identificadores.

## 5. Funcionalidades implementadas

### Administración

- Registro y listado de usuarios.
- Asignación de roles.
- Registro y listado de procesos.
- Administración de versiones de procesos.
- Configuración de nodos de inicio, condición, aprobación y fin.
- Creación de transiciones entre nodos.
- Selección dinámica de nodos según la versión del proceso.

### Seguridad

- Inicio de sesión mediante credenciales.
- Contraseñas protegidas con bcrypt.
- Control de acceso mediante sesiones.
- Protección de rutas administrativas con policies de Sails.js.
- Restricción de acceso para usuarios sin rol Administrador.
- Cierre de sesión.

## 6. Validaciones Back-End

El sistema implementa validaciones del lado del servidor para proteger la integridad de la configuración de los procesos.

Entre las reglas implementadas se encuentran:

1. Comprobar que los identificadores de entidades relacionadas existan.
2. Evitar números de versión duplicados dentro de un mismo proceso.
3. Permitir modificar la estructura de versiones únicamente mientras están en estado borrador.
4. Evitar más de un nodo de inicio por versión.
5. Impedir transiciones que conecten nodos de diferentes versiones.
6. Impedir transiciones con el mismo nodo como origen y destino.
7. Impedir transiciones que salgan de nodos de fin o ingresen a nodos de inicio.
8. Evitar transiciones duplicadas.

Estas reglas se verifican en los controladores y no dependen exclusivamente de la validación visual de los formularios.

## 7. Instalación local

### Requisitos

- Node.js y npm compatibles con Sails.js 1.5.18.
- Git.

### Descargar el proyecto

```bash
git clone URL_DEL_REPOSITORIO
cd flowforge-mvc
```

Reemplazar `URL_DEL_REPOSITORIO` por la dirección real del repositorio de GitHub.

### Instalar dependencias

```bash
npm install
```

### Iniciar el servidor

```bash
npx sails lift
```

Para un entorno de desarrollo nuevo, configurar la migración de modelos según corresponda. No utilizar `drop` ni `alter` sobre bases de datos que contengan información importante sin contar con un respaldo.

### Acceder a la aplicación

Abrir en el navegador:

```text
http://localhost:1337/login
```

Se necesita una cuenta Administrador previamente creada y configurada para acceder al módulo administrativo.

## 8. Pruebas realizadas

Durante el desarrollo local se verificaron:

- Inicio de sesión de Administrador.
- Bloqueo de usuarios sin sesión.
- Restricción de acceso a usuarios con rol Solicitante mediante HTTP 403.
- Cierre de sesión y bloqueo de acceso posterior.
- Validaciones de integridad entre versiones, nodos y transiciones.
- Rechazo de configuraciones duplicadas o inconsistentes.

## 9. Estado del proyecto

**Estado:** Implementado, desplegado y probado en producción.

FlowForge MVC está publicado mediante Render y utiliza PostgreSQL para la persistencia de los datos.

### Infraestructura

- **Hosting:** Render Web Service.
- **Framework:** Sails.js.
- **Base de datos:** PostgreSQL.
- **Sesiones:** Redis mediante Render Key Value.
- **Arquitectura:** Modelo-Vista-Controlador (MVC).

### Pruebas realizadas en producción

| Prueba | Resultado |
|---|---|
| Autenticación de Administrador | Correcto |
| Control de acceso por roles | Correcto |
| Administración de usuarios | Correcto |
| Administración de procesos | Correcto |
| Gestión de versiones | Correcto |
| Creación de nodos | Correcto |
| Creación de transiciones | Correcto |
| Validaciones Back-End | Correcto |
| Cierre de sesión | Correcto |

### Acceso al sistema

**URL pública:** PENDIENTE_AGREGAR_URL_RENDER

El acceso al módulo administrativo requiere una cuenta autorizada con rol Administrador.

Por seguridad, las credenciales de acceso y las variables de entorno no se publican en este repositorio.

### Demostración

**Video:** PENDIENTE_AGREGAR_ENLACE_VIDEO

## 10. Contexto académico

**Universidad:** Universidad de Las Américas (UDLA)  
**Asignatura:** Ingeniería Web  
**Actividad:** Tarea 8, Administración MVC  
**Proyecto:** FlowForge MVC

Este repositorio documenta la implementación académica del módulo administrativo de FlowForge.

<!-- Internally, Sails used [`sails-generate@2.0.13`](https://github.com/balderdashy/sails-generate/tree/v2.0.13/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

