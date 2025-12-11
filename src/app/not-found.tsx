import Link from 'next/link';
import { Home, Search, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <Gift className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-red-600 opacity-50" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            Página No Encontrada
          </h2>
          <p className="text-gray-600">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 gap-2">
              <Home className="h-4 w-4" />
              Ir al Inicio
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Gift className="h-4 w-4" />
              Ver Dashboard
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-sm text-gray-500">
          <p>¿Necesitas ayuda? Regresa al inicio o explora nuestras funcionalidades.</p>
        </div>
      </div>
    </div>
  );
}
