# Nova Salud

Sistema web de gestión de inventario y ventas para una botica.

## Tecnologías

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **ORM:** Prisma
- **Estilos:** CSS
- **Iconos:** Lucide React

## Requisitos previos

Instalar:

- Node.js y npm.
- XAMPP (MySQL).
- Git.

## Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/nova-salud.git
cd nova-salud
```

### 2. Configurar la base de datos

1. Iniciar MySQL desde XAMPP.
2. Crear una base de datos llamada `nova_salud` desde phpMyAdmin.

### 3. Configurar el Backend

Entrar a la carpeta:

```bash
cd backend
npm install
```

Crear un archivo `.env` en `backend/`:

```env
DATABASE_URL="mysql://root:@localhost:3306/nova_salud"
PORT=3000
```

Aplicar las migraciones:

```bash
npx prisma migrate deploy
```

Iniciar el servidor:

```bash
npm run dev
```

### 4. Configurar el Frontend

Abrir otra terminal y entrar a:

```bash
cd frontend
npm install
```

Crear un archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

Iniciar el frontend:

```bash
npm run dev
```

Abrir en el navegador:

```text
http://localhost:5173
```

## Notas importantes

- Los archivos `.env` no se suben a GitHub.
- Crear los archivos `.env` manualmente en cada computadora.
- No compartir contraseñas ni credenciales reales.
- Las carpetas `node_modules` se generan mediante `npm install`.
- Las migraciones de Prisma permiten reconstruir la estructura de la base de datos.
- Mantener actualizados los archivos `package.json` y `package-lock.json`.

## Estado del proyecto

Desarrollo en progreso.
