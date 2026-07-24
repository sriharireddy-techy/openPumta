'use client';
import Link from 'next/link';

import Image from 'next/image';
import { SignupForm } from '@/components/signup-form';
import { AuthSlideshow } from '@/components/auth-slideshow';

export default function SignupPage() {
  return (
    <div className="grid h-screen overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image src="/icon.svg" alt="icon" width={24} height={24} className="w-6 h-6" />
            openPumta
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative h-full">
        <AuthSlideshow />
      </div>
    </div>
  );
}
