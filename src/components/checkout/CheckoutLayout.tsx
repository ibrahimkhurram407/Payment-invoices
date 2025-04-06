import Head from "next/head";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PaymentMethodIcons } from "@/components/checkout/PaymentMethodIcons";
import Image from "next/image";
import Link from "next/link";

interface CheckoutLayoutProps {
  children: ReactNode;
  title?: string;
}

export function CheckoutLayout({ children, title = "DevRoom Checkout" }: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content="DevRoom payment checkout" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                width={40}
                height={40}
                className="animate-[pulseLogo_5s_infinite]"
                alt="DevRoom Logo"
                src="https://www.devroomteam.com/_next/image?url=%2Fdevroom_icon.png&w=64&q=75"
              />
              <h1 className="text-xl font-bold">DevRoom</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {children}
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 md:px-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <PaymentMethodIcons />
          <p className="mt-4">© {new Date().getFullYear()} DevRoom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}