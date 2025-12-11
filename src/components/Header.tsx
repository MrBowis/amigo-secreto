'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="border-b border-red-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold bg-linear-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Amigo Secreto
            </h1>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-red-700 hover:text-red-800 hover:bg-red-50">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                    Mi Lista
                  </Button>
                </Link>
                <Link href="/secret-santa">
                  <Button variant="ghost" className="text-red-700 hover:text-red-800 hover:bg-red-50">
                    Sorteos
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
