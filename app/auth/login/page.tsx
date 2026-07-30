import { MagicLinkLoginForm } from '@/app/components/login/MagicLinkLoginForm';

export default function AuthLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f0eb] px-4 py-10">
      <div className="w-full max-w-md">
        <MagicLinkLoginForm />
      </div>
    </main>
  );
}
