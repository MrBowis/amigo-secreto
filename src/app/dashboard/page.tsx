'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Gift, Users, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Felices Fiestas, {user.email}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Users className="h-6 w-6" />
                    Amigo Secreto
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Organiza sorteos de amigo secreto con tus amigos y familia
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Crea un nuevo sorteo o administra los sorteos existentes
                </p>
                <Link href="/secret-santa">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ir a Amigo Secreto
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <List className="h-6 w-6" />
                    Mi Lista de Deseos
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Crea y comparte tu lista de deseos con otros
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Agrega los regalos que te gustaría recibir
                </p>
                <Link href="/wishlist">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ir a Mi Lista
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-6 w-6 text-purple-600" />
              Accesos Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/secret-santa">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Crear Sorteo
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" className="w-full justify-start">
                  <List className="h-4 w-4 mr-2" />
                  Editar Lista
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="h-4 w-4 mr-2" />
                  Ver Listas Compartidas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
