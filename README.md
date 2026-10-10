# Manos de Confianza

Aplicación web para conectar familias de Mendoza con trabajadoras domésticas, cuidadoras, niñeras y personal de confianza.

## Demo pública

La app inicia en modo demo. No requiere login ni Supabase: la portada, los perfiles, las búsquedas y las vistas de familia, trabajadora y administración muestran datos ficticios navegables. Las acciones que requieren una cuenta real no guardan datos en este modo.

```powershell
npm install
npm run dev
```

Abrí `http://localhost:3000`. Para activar el flujo real de autenticación y Supabase más adelante, configurá las variables indicadas abajo y definí `NEXT_PUBLIC_DEMO_MODE=false`.

## Funcionalidad

- Registro seguro para familias y trabajadoras con confirmación por email.
- Inicio, cierre de sesión y recuperación completa de contraseña.
- Redirección y autorización por rol.
- Perfil laboral con foto, referencias y documentos privados.
- Publicación de búsquedas y postulaciones reales.
- Paneles conectados a datos reales para familia, trabajadora y administración.
- Revisión administrativa de perfiles y publicaciones.
- Row Level Security (RLS), límites de archivos y vistas públicas sin datos de contacto.
- Cabeceras de seguridad para producción.

## Desarrollo local

Requisitos: Node.js 20 o superior y un proyecto de Supabase.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

Configurá `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_ANON_PUBLICA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

La clave `anon` es pública y está protegida por RLS. Nunca agregues `service_role` al frontend ni a una variable `NEXT_PUBLIC_*`.

## Preparar Supabase

1. Creá un proyecto en Supabase.
2. Abrí **SQL Editor** y ejecutá completo [`sql/schema.sql`](sql/schema.sql).
3. En **Authentication > URL Configuration**, usá la URL de producción como Site URL.
4. Agregá como Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://TU-DOMINIO.vercel.app/auth/callback`
5. Mantené activa la confirmación de email.
6. Activá CAPTCHA para registro e inicio de sesión y revisá los límites de Auth.
7. Para producción, configurá un proveedor SMTP propio.

El registro público solo permite los roles `family` y `worker`. Para crear el primer administrador, registrá una cuenta normal y promovela exclusivamente desde SQL Editor:

```sql
update public.users_profiles
set role = 'admin'
where email = 'tu-email@dominio.com';
```

## Despliegue en Vercel

```powershell
npx vercel
```

En Vercel, agregá las tres variables de `.env.local` para Production y Preview. Después ejecutá:

```powershell
npx vercel --prod
```

Al conocer la URL final, actualizá `NEXT_PUBLIC_SITE_URL` y las URLs autorizadas en Supabase.

## Verificación

```powershell
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

Antes del lanzamiento comercial, completá la identidad, CUIT, domicilio, jurisdicción y correo del responsable en las páginas de términos y privacidad, y hacé revisar esos textos por un profesional de Argentina.
