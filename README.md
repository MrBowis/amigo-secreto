# 🎄 Amigo Secreto Navideño

Una aplicación web completa para organizar sorteos de amigo secreto navideño con listas de deseos integradas.

## ✨ Características

- 🔐 **Autenticación completa** - Login y registro con Firebase Auth (email/contraseña)
- 🎁 **Lista de Deseos** - Crea y gestiona tu wishlist con título y referencias de productos
- 🎲 **Sorteo de Amigo Secreto** - Crea sorteos, agrega participantes y realiza asignaciones automáticas
- 👥 **Gestión de Participantes** - Solo necesitas nombre y correo para cada participante
- 🎨 **Tema Navideño** - Diseño con colores rojos y verdes de Navidad
- 📱 **Responsive** - Funciona en todos los dispositivos

## 🛠️ Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Type safety
- **Firebase** - Autenticación y Firestore Database
- **shadcn/ui** - Componentes UI (Avatar, Badge, Button, Card, Dialog, Form, Input, Label)
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── dashboard/         # Panel principal del usuario
│   ├── login/            # Página de inicio de sesión
│   ├── signup/           # Página de registro
│   ├── wishlist/         # Gestión de lista de deseos
│   ├── secret-santa/     # Gestión de sorteos
│   ├── layout.tsx        # Layout principal con Header y AuthProvider
│   ├── page.tsx          # Página de inicio
│   └── globals.css       # Estilos globales con tema navideño
├── components/
│   ├── auth/             # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   └── SignUpForm.tsx
│   ├── wishlist/         # Componentes de wishlist
│   │   ├── WishlistForm.tsx
│   │   └── WishlistDisplay.tsx
│   ├── secret-santa/     # Componentes de amigo secreto
│   │   ├── SecretSantaForm.tsx
│   │   ├── SecretSantaDisplay.tsx
│   │   └── ParticipantCard.tsx
│   ├── ui/               # Componentes shadcn/ui
│   ├── Header.tsx        # Navegación principal
│   └── ProtectedRoute.tsx # HOC para rutas protegidas
├── contexts/
│   └── AuthContext.tsx   # Contexto de autenticación
├── lib/
│   ├── firebase.ts       # Configuración de Firebase
│   ├── secretSantaUtils.ts # Algoritmo de sorteo
│   └── utils.ts          # Utilidades generales
└── types/
    └── index.ts          # Definiciones de TypeScript
```

## 🚀 Configuración e Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** con método Email/Password
3. Crea una base de datos **Firestore** en modo test (o producción con reglas apropiadas)
4. Obtén las credenciales de tu proyecto Firebase

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Configurar reglas de Firestore (recomendado)

En Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Wishlists - solo el dueño puede leer/escribir
    match /wishlists/{wishlistId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Secret Santas - solo el creador puede gestionar
    match /secretSantas/{secretSantaId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.createdBy;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.createdBy;
    }
  }
}
```

### 5. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📖 Uso

### Crear una Cuenta
1. Ve a la página de inicio
2. Haz clic en "Registrarse"
3. Ingresa tu correo y contraseña (mínimo 6 caracteres)

### Crear Lista de Deseos
1. Inicia sesión
2. Ve a "Mi Lista de Deseos"
3. Agrega productos con título y referencia (URL)
4. Guarda tu lista

### Crear un Sorteo de Amigo Secreto
1. Ve a "Sorteos"
2. Completa el formulario:
   - Nombre del sorteo
   - Agrega participantes (nombre y correo)
   - Mínimo 2 participantes
3. Haz clic en "Crear Sorteo"
4. Realiza el sorteo para ver las asignaciones

### Ver Asignaciones
- Después del sorteo, verás cards con avatares de cada participante
- Cada card muestra a quién le toca regalar

## 🎨 Personalización del Tema

Los colores navideños están definidos en `src/app/globals.css`:

- **Rojo primario**: Para botones principales y acentos
- **Verde secundario**: Para elementos complementarios
- **Fondos cálidos**: Tonos cremosos para un ambiente acogedor

## 📦 Build para Producción

```bash
npm run build
npm start
```

## 📝 Deploy on Vercel

El deploy más fácil es usando [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de deploy de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

---

¡Felices Fiestas! 🎄✨
