# 🌐 Guía de Despliegue

## Desplegar en Vercel (Recomendado)

### Opción 1: Deploy desde GitHub

1. **Sube tu código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Amigo Secreto app"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configura Variables de Entorno**:
   En la página de configuración del proyecto, añade:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   ```

4. **Deploy**:
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará tu aplicación
   - Obtendrás una URL como: `https://tu-proyecto.vercel.app`

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Para producción
vercel --prod
```

## Configurar Dominio Autorizado en Firebase

Después del deploy, debes autorizar tu dominio en Firebase:

1. Ve a Firebase Console > Authentication > Settings
2. En "Authorized domains", añade:
   - `tu-proyecto.vercel.app`
   - Tu dominio personalizado (si tienes uno)

## Desplegar en Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Añade las mismas que en Vercel

## Desplegar en Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Selecciona:
# - Use an existing project
# - Build directory: .next
# - Configure as SPA: No
# - Set up automatic builds: Optional

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

## Checklist Pre-Deploy

- [ ] Verificar que `.env.local` NO está en el repositorio
- [ ] Configurar variables de entorno en la plataforma de hosting
- [ ] Actualizar reglas de Firestore a modo producción
- [ ] Probar autenticación localmente
- [ ] Probar creación de wishlist y sorteos
- [ ] Verificar que todas las rutas funcionan
- [ ] Revisar que los colores navideños se vean bien

## Configuración Post-Deploy

### 1. Firestore Security Rules (Producción)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishlists/{wishlistId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    match /secretSantas/{secretSantaId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.createdBy;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.createdBy;
    }
  }
}
```

### 2. Firebase Authentication Settings

- Habilita Email Enumeration Protection
- Configura Email Templates personalizados (opcional)
- Añade dominios autorizados

### 3. Performance

```bash
# Analizar el bundle
npm run build

# Verificar lighthouse score
# Usar Chrome DevTools > Lighthouse
```

## Monitoreo

### Firebase Console
- Authentication > Users (ver usuarios registrados)
- Firestore > Data (ver wishlists y sorteos)
- Analytics (si lo habilitaste)

### Vercel Dashboard
- Ver logs de deploy
- Monitorear uso y performance
- Ver analytics de visitantes

## Dominio Personalizado

### En Vercel:
1. Ve a Settings > Domains
2. Añade tu dominio
3. Configura DNS según las instrucciones

### DNS Records (ejemplo):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## SSL/HTTPS

- Vercel configura SSL automáticamente
- Firebase Hosting también incluye SSL
- No necesitas configuración adicional

## Troubleshooting

### Error: "auth/unauthorized-domain"
- Añade el dominio en Firebase Console > Authentication > Settings > Authorized domains

### Error: Variables de entorno no funcionan
- Asegúrate de que empiecen con `NEXT_PUBLIC_`
- Redeploya después de añadir variables

### Error: Firestore permission denied
- Verifica las reglas de seguridad
- Asegúrate de estar autenticado

## Actualizaciones

Para actualizar tu app en producción:

```bash
# Hacer cambios
git add .
git commit -m "Descripción del cambio"
git push

# Vercel desplegará automáticamente
# O usa: vercel --prod
```

## Backup de Datos

### Export Firestore Data:
```bash
gcloud firestore export gs://[BUCKET_NAME]
```

### Backup Regular:
- Configura exports automáticos en Firebase Console
- Firestore > Import/Export

## Costos Estimados

### Firebase (Free Tier):
- Auth: 10K verificaciones/mes gratis
- Firestore: 1GB storage + 50K lecturas/día gratis
- Hosting: 10GB transferencia/mes gratis

### Vercel (Free):
- 100GB bandwidth/mes
- Deployments ilimitados
- Dominio .vercel.app gratis

**Para uso personal/pequeño, todo puede ser GRATIS** 🎉

---

¡Tu app estará en vivo en minutos! 🚀
