# 🍽️ Sistema de Restaurante Digital

Sistema completo de gestión para restaurantes desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**. Incluye gestión de usuarios, mesas, platillos, órdenes, cocina digital, promociones y facturación automatizada.

## 👥 Equipo de Desarrollo

| Nombre |
|--------|
| **Camila Melara** | 
| **Diego Morales** | 
| **Daniela Pineda** |
| **Génesis Parada** |
| **Ximena Zelaya** | 

---

## 🚀 Características Principales

### ✨ **Funcionalidades Core**
- 🔐 **Autenticación JWT** con roles granulares
- 👥 **Gestión de usuarios** (Admin, Mesero, Cocinero, Cliente)
- 🪑 **Control de mesas** (disponible/ocupada)
- 🍽️ **Catálogo de platillos** con categorías
- 🎯 **Sistema de promociones** (porcentaje, cantidad fija, combos)
- 📦 **Gestión de órdenes** con cálculo automático
- 👨‍🍳 **Pantalla digital de cocina** con estados en tiempo real
- 🧾 **Facturación automática** con descuentos aplicados

### 🏗️ **Arquitectura Técnica**
- **Backend:** NestJS + TypeScript
- **Base de Datos:** PostgreSQL + TypeORM
- **Autenticación:** JWT con guards y roles
- **Eventos:** EventEmitter2 para comunicación en tiempo real
- **Documentación:** Swagger/OpenAPI automática
- **Testing:** Jest con coverage completo

---

## 📊 API Endpoints (42 Total)

### 🔐 **Autenticación (2 endpoints)**
```
POST   /auth/login              - Iniciar sesión
GET    /auth/profile            - Obtener perfil usuario
```

### 👥 **Usuarios (7 endpoints)**
```
POST   /users                   - Crear usuario
GET    /users                   - Listar usuarios
GET    /users/:id               - Obtener usuario
PATCH  /users/:id               - Actualizar usuario
PATCH  /users/:id/reactivate    - Reactivar usuario
DELETE /users/:id               - Desactivar usuario
GET    /users/rol/:role         - Filtrar por rol
```

### 🪑 **Mesas (4 endpoints)**
```
POST   /mesas                   - Crear mesa
GET    /mesas                   - Listar mesas
PATCH  /mesas/:id/ocupar        - Marcar como ocupada
PATCH  /mesas/:id/disponible    - Marcar como disponible
```

### 🍽️ **Platillos (5 endpoints)**
```
POST   /platillos               - Crear platillo
GET    /platillos               - Listar platillos
GET    /platillos/:id           - Obtener platillo
PUT    /platillos/:id           - Actualizar platillo
DELETE /platillos/:id           - Eliminar platillo
```

### 🎯 **Promociones (6 endpoints)**
```
POST   /promociones                      - Crear promoción
GET    /promociones                      - Listar promociones
GET    /promociones/:id                  - Obtener promoción
PUT    /promociones/:id                  - Actualizar promoción
DELETE /promociones/:id                  - Eliminar promoción
GET    /promociones/activas/buscar       - Buscar promociones activas
```

### 📦 **Órdenes (4 endpoints)**
```
POST   /ordenes                 - Crear orden
GET    /ordenes                 - Listar órdenes
GET    /ordenes/estado/:estado  - Filtrar por estado
PATCH  /ordenes/:id/estado      - Cambiar estado
```

### 🧾 **Facturas (3 endpoints)**
```
POST   /facturas/:ordenId       - Generar factura
GET    /facturas                - Listar facturas
GET    /facturas/:id            - Obtener factura
```

### 👨‍🍳 **Cocina (17 endpoints)**
```
# Gestión de Notificaciones
POST   /cocina/notificaciones                    - Crear notificación
GET    /cocina/notificaciones                    - Obtener notificaciones
GET    /cocina/notificaciones/:id                - Obtener notificación específica
PATCH  /cocina/notificaciones/:id/estado        - Actualizar estado
PATCH  /cocina/notificaciones/:id/asignar-cocinero - Asignar cocinero
DELETE /cocina/notificaciones/:id/cancelar      - Cancelar orden

# Pantalla Digital
GET    /cocina/pantalla                         - Vista principal
GET    /cocina/pantalla/cocinero/:cocineroId    - Vista por cocinero
GET    /cocina/pantalla/mesa/:mesa              - Vista por mesa
PATCH  /cocina/pantalla/:id/iniciar             - Iniciar preparación
PATCH  /cocina/pantalla/:id/finalizar           - Finalizar preparación
PATCH  /cocina/pantalla/:id/entregar            - Marcar entregada
GET    /cocina/pantalla/actualizaciones         - Polling actualizaciones

# Estadísticas y Reportes
GET    /cocina/estadisticas                     - Estadísticas generales
GET    /cocina/historial/orden/:ordenId         - Historial de orden
GET    /cocina/reportes/tiempos                 - Reporte de tiempos
POST   /cocina/ordenes/:ordenId/notificar       - Notificar nueva orden
```

---

## 🛠️ Instalación y Configuración

### **Prerrequisitos**
- Node.js >= 18
- PostgreSQL >= 13
- npm >= 8

### **1. Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd sistema-restaurante
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Crear archivo `.env` en la raíz:
```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=restaurante_db

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro

# Servidor
PORT=3000
```

### **4. Configurar base de datos**
```bash
# Crear base de datos en PostgreSQL
createdb restaurante_db

# Las tablas se crean automáticamente con TypeORM
```

### **5. Ejecutar el proyecto**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```


---

## 📖 Documentación API

### **Swagger UI**
Una vez ejecutando el servidor, visita:
```
http://localhost:3000/api
```

### **Ejemplos de uso**

#### **Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurante.com",
    "password": "Admin123"
  }'
```

#### **Crear platillo**
```bash
curl -X POST http://localhost:3000/platillos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Hamburguesa Clásica",
    "descripcion": "Hamburguesa con carne, lechuga y tomate",
    "precioBase": 12.99,
    "categoria": "plato_principal"
  }'
```

#### **Crear orden**
```bash
curl -X POST http://localhost:3000/ordenes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mesa": 1,
    "usuario": "cliente@restaurante.com",
    "items": [
      {
        "platilloId": 1,
        "nombre": "Hamburguesa Clásica",
        "categoria": "plato_principal",
        "precio": 12.99,
        "cantidad": 2
      }
    ]
  }'
```

---

## 🎯 Flujo de Trabajo

### **1. Flujo típico de restaurante**
```
👤 Mesero → 🪑 Mesa ocupada → 📝 Tomar orden → 📦 Crear orden
    ↓
🎯 Sistema aplica promociones → 💰 Calcula totales
    ↓
👨‍🍳 Cocina recibe notificación → 🔥 Inicia preparación
    ↓
✅ Orden lista → 🍽️ Mesero entrega → 🧾 Genera factura
    ↓
🪑 Mesa disponible → 📊 Estadísticas actualizadas
```

### **2. Roles y permisos**

| Rol | Permisos |
|-----|----------|
| **Admin** | Acceso completo a todo el sistema |
| **Mesero** | Gestión de mesas, órdenes y facturas |
| **Cocinero** | Pantalla de cocina y gestión de preparación |
| **Cliente** | Consulta de platillos y promociones |

---

## 🔧 Tecnologías Utilizadas

### **Backend**
- **NestJS** - Framework Node.js
- **TypeScript** - Lenguaje tipado
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **Swagger** - Documentación API
- **Jest** - Testing framework
- **class-validator** - Validación de DTOs
- **bcryptjs** - Hash de contraseñas

---

## 📝 Estructura del Proyecto

```
src/
├── auth/                    # Autenticación JWT
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── users/                   # Gestión de usuarios
│   ├── dto/
│   └── entities/
├── mesa/                    # Control de mesas
├── platillos/              # Catálogo de platillos
├── promociones/            # Sistema de promociones
├── ordenes/                # Gestión de órdenes
├── factura/                # Facturación
├── cocina/                 # Sistema de cocina
│   ├── dto/
│   ├── entities/
│   ├── events/
│   └── listeners/
└── common/                 # Utilidades compartidas
    └── enums/
```

---

## 📊 Estadísticas del Proyecto

- **42 endpoints** REST implementados
- **9 módulos** principales
- **Cobertura de tests** > 80%
- **Documentación** 100% actualizada
- **Arquitectura** escalable y mantenible

¡Gracias por usar nuestro Sistema de Restaurante Digital! 🍽️✨
