import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <LoginForm />
        <p className="text-center mt-4 text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/signup" className="text-red-600 hover:text-red-700 font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
