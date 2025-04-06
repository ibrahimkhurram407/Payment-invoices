import Head from "next/head";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Head>
        <title>DevRoom Payment</title>
        <meta name="description" content="DevRoom payment system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">DevRoom's Payment Homepage</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl text-center mb-12">
          Welcome to DevRoom's payment system. This is the main entry point for all payment processing.
        </p>
      </main>
    </div>
  );
}