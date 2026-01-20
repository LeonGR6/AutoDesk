

## Información del proyecto
## ¿Cómo puedo editar este código?
Hay varias maneras de editar tu aplicación.

Paso 1: Clona el repositorio usando la URL de Git del proyecto.
git clone <TU_URL_DE_GIT>
Paso 2: Navega al directorio del proyecto.
cd <NOMBRE_DE_TU_PROYECTO>
Paso 3: Instala las dependencias necesarias.
npm i
Paso 4: Inicia el servidor de desarrollo con recarga automática y vista previa instantánea.
npm run dev

## ¿Qué tecnologías se utilizan en este proyecto?
Este proyecto se creó con:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Configuracion de la base de datos supabase
Ve a supabase.com

Haz clic en "New project"
Configura:
Name: autodesk (o el nombre que prefieras)
Database Password: Guarda esta contraseña
Region: Elige la más cercana
Pricing Plan: Free tier es suficiente

# Paso 2: Obtener credenciales
En tu proyecto de Supabase, ve a Settings > API
Copia las siguientes credenciales:
URL (Project URL)
anon/public key
service_role key (opcional, para administración)

# Paso 3: Configurar .env
Abre el archivo .env y reemplaza con tus credenciales:
env
VITE_SUPABASE_URL=https://tudominio.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aquí

# Paso 4: Crear las tablas en la base de datos
Opción A: Usar el SQL Editor en Supabase
Ve a SQL Editor en el panel de Supabase
Crea una nueva consulta
Copia y ejecuta este SQL:
auto desk\autodesk\supabase\migrations ejecutalo en SQL editor para obtener tablas y registros de ejemplo en tu archivo local

