'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Gift, Users, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Gift className="h-24 w-24 mx-auto text-red-600 mb-4" />
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            Amigo Secreto Navideño
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organiza tu intercambio de regalos y crea tu lista de deseos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg border border-red-200 bg-red-50/50">
            <Users className="h-12 w-12 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-red-800">Organiza Sorteos</h3>
            <p className="text-sm text-gray-600">
              Crea sorteos de amigo secreto fácilmente con tus amigos y familia
            </p>
          </div>
          <div className="p-6 rounded-lg border border-green-200 bg-green-50/50">
            <List className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-green-800">Lista de Deseos</h3>
            <p className="text-sm text-gray-600">
              Crea tu wishlist con productos y referencias para tus regalos
            </p>
          </div>
          <div className="p-6 rounded-lg border border-red-200 bg-red-50/50">
            <Gift className="h-12 w-12 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-red-800">Descubre</h3>
            <p className="text-sm text-gray-600">
              Ve las asignaciones y listas de deseos de tus amigos secretos
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Comenzar Ahora
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

