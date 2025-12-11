# 📂 Estructura Completa del Proyecto

```
wishlist/
│
├── 📄 README.md                    # Documentación principal
├── 📄 QUICKSTART.md               # Guía de inicio rápido
├── 📄 FIREBASE_SETUP.md           # Configuración Firebase
├── 📄 DEPLOYMENT.md               # Guía de despliegue
├── 📄 PROJECT_SUMMARY.md          # Resumen técnico
│
├── 📄 package.json                # Dependencias
├── 📄 tsconfig.json               # Configuración TypeScript
├── 📄 next.config.ts              # Configuración Next.js
├── 📄 components.json             # Configuración shadcn/ui
├── 📄 .env.local.example          # Ejemplo variables entorno
├── 📄 .env.local                  # Variables (NO SUBIR A GIT)
├── 📄 .gitignore                  # Archivos ignorados
│
└── src/
    │
    ├── 📁 app/                    # Páginas y rutas
    │   ├── 📄 layout.tsx          # Layout raíz con Header, Footer y AuthProvider
    │   ├── 📄 page.tsx            # Landing page (/)
    │   ├── 📄 globals.css         # Estilos globales + tema navideño
    │   │
    │   ├── 📁 login/
    │   │   └── 📄 page.tsx        # Página de login (/login)
    │   │
    │   ├── 📁 signup/
    │   │   └── 📄 page.tsx        # Página de registro (/signup)
    │   │
    │   ├── 📁 dashboard/
    │   │   └── 📄 page.tsx        # Dashboard principal (/dashboard)
    │   │
    │   ├── 📁 wishlist/
    │   │   └── 📄 page.tsx        # Gestión de wishlist (/wishlist)
    │   │
    │   └── 📁 secret-santa/
    │       └── 📄 page.tsx        # Gestión de sorteos (/secret-santa)
    │
    ├── 📁 components/
    │   │
    │   ├── 📄 Header.tsx          # Barra de navegación
    │   ├── 📄 Footer.tsx          # Pie de página
    │   ├── 📄 ProtectedRoute.tsx  # HOC para rutas privadas
    │   │
    │   ├── 📁 auth/               # Componentes de autenticación
    │   │   ├── 📄 LoginForm.tsx   # Formulario de login
    │   │   └── 📄 SignUpForm.tsx  # Formulario de registro
    │   │
    │   ├── 📁 wishlist/           # Componentes de lista de deseos
    │   │   ├── 📄 WishlistForm.tsx    # Formulario crear/editar
    │   │   └── 📄 WishlistDisplay.tsx # Visualización
    │   │
    │   ├── 📁 secret-santa/       # Componentes de amigo secreto
    │   │   ├── 📄 SecretSantaForm.tsx    # Formulario de sorteo
    │   │   ├── 📄 SecretSantaDisplay.tsx # Lista de sorteos
    │   │   └── 📄 ParticipantCard.tsx    # Card de participante
    │   │
    │   └── 📁 ui/                 # Componentes shadcn/ui
    │       ├── 📄 avatar.tsx
    │       ├── 📄 badge.tsx
    │       ├── 📄 button.tsx
    │       ├── 📄 card.tsx
    │       ├── 📄 dialog.tsx
    │       ├── 📄 form.tsx
    │       ├── 📄 input.tsx
    │       └── 📄 label.tsx
    │
    ├── 📁 contexts/
    │   └── 📄 AuthContext.tsx     # Context de autenticación global
    │
    ├── 📁 lib/
    │   ├── 📄 firebase.ts         # Configuración Firebase
    │   ├── 📄 secretSantaUtils.ts # Algoritmo de sorteo
    │   └── 📄 utils.ts            # Utilidades generales
    │
    └── 📁 types/
        └── 📄 index.ts            # Tipos TypeScript

```

## 🎯 Componentes por Función

### 🔐 Autenticación
```
AuthContext.tsx          → Provider global de autenticación
LoginForm.tsx            → Formulario de inicio de sesión
SignUpForm.tsx           → Formulario de registro
ProtectedRoute.tsx       → Protección de rutas privadas
```

### 🎁 Wishlist
```
WishlistForm.tsx         → Crear/editar productos
WishlistDisplay.tsx      → Mostrar lista de productos
```

### 🎲 Amigo Secreto
```
SecretSantaForm.tsx      → Crear sorteo + agregar participantes
SecretSantaDisplay.tsx   → Mostrar sorteos + botón realizar
ParticipantCard.tsx      → Card individual con avatar
secretSantaUtils.ts      → Algoritmo de asignación aleatoria
```

### 🧭 Navegación
```
Header.tsx               → Barra superior con menú
Footer.tsx               → Pie de página
layout.tsx               → Estructura general
```

### 📄 Páginas
```
/                        → Landing page (público)
/login                   → Iniciar sesión (público)
/signup                  → Registrarse (público)
/dashboard               → Panel principal (privado)
/wishlist                → Mi lista de deseos (privado)
/secret-santa            → Mis sorteos (privado)
```

## 🎨 Tema Navideño

### Colores Principales
```css
--primary: Red (#DC2626)      → Botones principales, sorteo
--secondary: Green (#059669)  → Wishlist, elementos secundarios
--background: Warm cream      → Fondo acogedor
```

### Componentes Estilizados
- ✅ Botones rojos/verdes según contexto
- ✅ Cards con bordes navideños
- ✅ Avatares con gradiente rojo-verde
- ✅ Inputs con estilos suaves

## 🗄️ Base de Datos (Firebase)

### Collections
```
wishlists/
  └── {wishlistId}
      ├── userId: string
      ├── items: array
      ├── createdAt: timestamp
      └── updatedAt: timestamp

secretSantas/
  └── {secretSantaId}
      ├── name: string
      ├── createdBy: string
      ├── participants: array
      ├── assignments: array
      ├── createdAt: timestamp
      └── isDrawn: boolean
```

## 📦 Dependencias Clave

```json
{
  "next": "16.0.6",
  "react": "19.2.0",
  "firebase": "^12.6.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@radix-ui/*": "shadcn components",
  "lucide-react": "^0.555.0",
  "react-hook-form": "^7.67.0",
  "zod": "^4.1.13"
}
```

## 🔄 Flujo de Datos

```
Usuario → Formulario → Firebase → Context → UI
   ↑                                          ↓
   └────────── Actualización automática ──────┘
```

## 🚀 Scripts

```bash
npm run dev        # Desarrollo (localhost:3000)
npm run build      # Producción (optimizado)
npm start          # Servir build de producción
npm run lint       # Verificar código
```

---

**Total de archivos creados**: 30+ componentes y páginas  
**Líneas de código**: ~2000+ líneas  
**Estado**: ✅ Completado y funcional
