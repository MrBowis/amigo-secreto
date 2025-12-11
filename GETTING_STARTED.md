# 🎄 ¡Bienvenido a tu App de Amigo Secreto Navideño!

## ✨ Tu aplicación está lista

He creado una aplicación completa y funcional con todas las características que solicitaste:

### ✅ Características Implementadas

#### 🔐 Sistema de Autenticación
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios (Sign Up)
- ✅ Protección de rutas privadas
- ✅ Sesión persistente con Firebase Auth

#### 🎁 Módulo de Wishlist
- ✅ Crear lista de deseos
- ✅ Agregar productos con título y referencia
- ✅ Editar lista existente
- ✅ Visualización bonita con cards

#### 🎲 Módulo de Amigo Secreto
- ✅ Crear sorteos (requiere login)
- ✅ Agregar participantes con nombre y correo
- ✅ Algoritmo de asignación aleatoria
- ✅ Visualización con cards y avatares

#### 🎨 Diseño Navideño
- ✅ Colores rojos y verdes de Navidad
- ✅ Componentes shadcn/ui personalizados
- ✅ Diseño modular y organizado
- ✅ Responsive (móvil, tablet, desktop)

## 🚀 Pasos para Comenzar

### 1. Configura Firebase (5 minutos)

Lee la guía completa: **`FIREBASE_SETUP.md`**

**Resumen rápido**:
1. Crea proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication → Email/Password
3. Crea Firestore Database
4. Copia las credenciales del proyecto

### 2. Configura Variables de Entorno

Crea el archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Instala y Ejecuta

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📖 Cómo Usar la App

### Primera Vez

1. **Crea una cuenta**:
   - Haz clic en "Registrarse"
   - Ingresa email y contraseña (mínimo 6 caracteres)
   - Serás redirigido al dashboard

2. **Explora el Dashboard**:
   - Verás 3 cards principales
   - "Mi Lista de Deseos" (verde)
   - "Mis Sorteos" (rojo)
   - Guía rápida de uso

3. **Crea tu Wishlist**:
   - Clic en "Mi Lista de Deseos"
   - Agrega productos con título y URL
   - Puedes agregar múltiples productos
   - Guarda la lista

4. **Crea un Sorteo**:
   - Clic en "Mis Sorteos"
   - Ingresa nombre del sorteo
   - Agrega participantes (mínimo 2):
     - Nombre completo
     - Correo electrónico
   - Clic en "Crear Sorteo"

5. **Realiza el Sorteo**:
   - En el sorteo creado, clic en "Realizar Sorteo"
   - Verás cards con avatares
   - Cada card muestra quién le toca regalar a quién

## 📂 Archivos de Documentación

- **README.md** → Documentación completa
- **QUICKSTART.md** → Inicio rápido
- **FIREBASE_SETUP.md** → Configuración detallada Firebase
- **DEPLOYMENT.md** → Cómo desplegar en producción
- **PROJECT_SUMMARY.md** → Resumen técnico
- **PROJECT_STRUCTURE.md** → Estructura de archivos

## 🎨 Personalización

### Cambiar Colores

Edita `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.5 0.22 25);    /* Rojo navideño */
  --secondary: oklch(0.45 0.18 145); /* Verde navideño */
}
```

### Agregar Más Funcionalidades

La estructura modular facilita agregar:
- Notificaciones por email
- Compartir wishlists
- Límites de presupuesto
- Historial de sorteos
- Y mucho más...

## 🐛 Solución de Problemas

### No puedo registrarme
- ✅ Verifica que configuraste Firebase Auth
- ✅ Revisa que Email/Password esté habilitado
- ✅ Mira la consola del navegador para errores

### Error de permisos en Firestore
- ✅ Configura las reglas de Firestore (ver FIREBASE_SETUP.md)
- ✅ Asegúrate de estar autenticado

### Variables de entorno no funcionan
- ✅ Deben empezar con `NEXT_PUBLIC_`
- ✅ Reinicia el servidor después de cambiarlas
- ✅ El archivo debe llamarse `.env.local`

## 📱 Estructura de Páginas

```
/                → Landing page (público)
/login           → Iniciar sesión
/signup          → Registrarse
/dashboard       → Panel principal (requiere login)
/wishlist        → Mi lista de deseos (requiere login)
/secret-santa    → Mis sorteos (requiere login)
```

## 🎯 Próximos Pasos Sugeridos

1. **Ahora**:
   - ✅ Configura Firebase
   - ✅ Prueba la aplicación localmente
   - ✅ Crea algunos sorteos de prueba

2. **Después**:
   - 📧 Agregar notificaciones por email
   - 🔗 Compartir wishlists por enlace
   - 💰 Límite de presupuesto
   - 📊 Analytics y estadísticas

3. **Producción**:
   - 🚀 Desplegar en Vercel (gratis)
   - 🔒 Configurar reglas de seguridad
   - 🌐 Dominio personalizado (opcional)

## 💡 Tips

- Los colores rojos son para "Sorteos"
- Los colores verdes son para "Wishlist"
- Los avatares se generan con iniciales
- Mínimo 2 participantes por sorteo
- Las listas se pueden editar siempre

## 🎅 ¡A Disfrutar!

Tu aplicación está **100% funcional** y lista para usar. Solo necesitas:
1. Configurar Firebase (5 min)
2. Agregar las credenciales a `.env.local`
3. Ejecutar `npm run dev`

¡Felices Fiestas! 🎄✨

---

**¿Necesitas ayuda?** Revisa la documentación o los archivos de ejemplo.
