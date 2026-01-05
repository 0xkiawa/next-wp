import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/404.jpg"
        alt="Page not found"
        layout="fill"
        objectFit="cover"
        className="z-0 md:object-cover object-contain"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 text-white p-4">
        <h1 className="text-7xl font-bold mb-4">Seems like you<br />are lost.</h1>
        <p className="mb-8">
          it could be you. it could be us. but let&apos;s take you back home..
        </p>
        <Button asChild className="not-prose mt-6">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}