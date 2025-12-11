# 🔥 Guía de Configuración de Firebase

Esta guía te ayudará a configurar Firebase para tu aplicación de Amigo Secreto Navideño.

## Paso 1: Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" (Add project)
3. Ingresa un nombre para tu proyecto, por ejemplo: "amigo-secreto-navidad"
4. Acepta los términos y haz clic en "Continuar"
5. (Opcional) Habilita Google Analytics si lo deseas
6. Haz clic en "Crear proyecto"

## Paso 2: Configurar Authentication

1. En la consola de Firebase, ve a **Build > Authentication**
2. Haz clic en "Get started" (Comenzar)
3. En la pestaña "Sign-in method":
   - Haz clic en "Email/Password"
   - Habilita el toggle de "Email/Password"
   - (Opcional) Puedes dejar deshabilitado "Email link"
   - Haz clic en "Save" (Guardar)

## Paso 3: Crear Base de Datos Firestore

1. En la consola de Firebase, ve a **Build > Firestore Database**
2. Haz clic en "Create database" (Crear base de datos)
3. Selecciona el modo de inicio:
   - **Modo de prueba** (Test mode): Para desarrollo (datos públicos por 30 días)
   - **Modo de producción** (Production mode): Recomendado con reglas personalizadas
4. Selecciona la ubicación del servidor (elige la más cercana a tus usuarios)
5. Haz clic en "Enable" (Habilitar)

## Paso 4: Configurar Reglas de Seguridad (Importante)

### Para Desarrollo (Temporal)
En Firestore > Rules, usa estas reglas temporales:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 1, 31);
    }
  }
}
```

### Para Producción (Recomendado)
Usa estas reglas seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla para wishlists
    match /wishlists/{wishlistId} {
      // Los usuarios autenticados pueden leer su propia wishlist
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      
      // Los usuarios autenticados pueden crear su propia wishlist
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      
      // Los usuarios pueden actualizar solo su propia wishlist
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
      
      // Los usuarios pueden eliminar solo su propia wishlist
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
    }
    
    // Regla para secretSantas
    match /secretSantas/{secretSantaId} {
      // Los usuarios autenticados pueden leer los sorteos que crearon
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.createdBy;
      
      // Los usuarios pueden crear sorteos
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.createdBy;
      
      // Solo el creador puede actualizar el sorteo
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.createdBy;
      
      // Solo el creador puede eliminar el sorteo
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.createdBy;
    }
  }
}
```

## Paso 5: Obtener las Credenciales

1. En la consola de Firebase, ve a **Configuración del proyecto** (ícono de engranaje ⚙️ > Project settings)
2. Baja hasta la sección "Tus apps" (Your apps)
3. Haz clic en el ícono web `</>` para crear una app web
4. Dale un nombre a tu app (ej: "Amigo Secreto Web")
5. (Opcional) Habilita Firebase Hosting si planeas usar ese servicio
6. Haz clic en "Registrar app" (Register app)
7. Copia las credenciales que aparecen en el objeto `firebaseConfig`

Las credenciales se verán así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Paso 6: Configurar Variables de Entorno

1. En la raíz de tu proyecto, crea un archivo `.env.local`
2. Copia las credenciales en el formato correcto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**⚠️ Importante:** 
- Nunca subas el archivo `.env.local` a Git
- El archivo `.gitignore` ya está configurado para ignorarlo
- Guarda estas credenciales en un lugar seguro

## Paso 7: Verificar la Configuración

1. Reinicia el servidor de desarrollo si está corriendo:
   ```bash
   # Detén el servidor (Ctrl + C)
   npm run dev
   ```

2. Abre la aplicación en [http://localhost:3000](http://localhost:3000)

3. Intenta registrar un nuevo usuario:
   - Ve a "Registrarse"
   - Ingresa un email y contraseña
   - Si funciona correctamente, verás el usuario en Firebase Console > Authentication

4. Verifica Firestore:
   - Crea una lista de deseos
   - Ve a Firebase Console > Firestore Database
   - Deberías ver la colección `wishlists` con tus datos

## Estructura de Datos en Firestore

### Colección: `wishlists`
```javascript
{
  userId: "uid-del-usuario",
  items: [
    {
      id: "timestamp-index",
      title: "Nombre del producto",
      reference: "https://enlace-al-producto.com",
      createdAt: Timestamp
    }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección: `secretSantas`
```javascript
{
  name: "Nombre del sorteo",
  createdBy: "uid-del-usuario",
  participants: [
    {
      id: "timestamp-index",
      name: "Nombre del participante",
      email: "email@ejemplo.com"
    }
  ],
  assignments: [
    {
      giverId: "id-participante-que-da",
      receiverId: "id-participante-que-recibe"
    }
  ],
  createdAt: Timestamp,
  isDrawn: boolean
}
```

## Solución de Problemas

### Error: "Firebase App named '[DEFAULT]' already exists"
- Reinicia el servidor de desarrollo
- Verifica que no estés inicializando Firebase en múltiples lugares

### Error: "Permission denied" en Firestore
- Verifica que las reglas de Firestore estén configuradas correctamente
- Asegúrate de estar autenticado antes de hacer operaciones

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor después de cambiar las variables de entorno

### Los usuarios no se guardan en Authentication
- Verifica que Email/Password esté habilitado en Firebase Console
- Revisa la consola del navegador para ver errores específicos

## Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

¡Listo! Ya tienes Firebase configurado para tu aplicación de Amigo Secreto 🎄
