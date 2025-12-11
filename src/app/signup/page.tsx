import { SignUpForm } from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <SignUpForm />
        <p className="text-center mt-4 text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
