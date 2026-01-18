import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/image/logo.png" alt="Smart Air Logo" width={48} height={48} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            Welcome to Smart Air
          </h1>
          <p className="text-muted-foreground">Sign in to monitor your environment</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
