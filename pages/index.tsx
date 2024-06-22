import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <h1 className="text-red-100 font-medium text-3xl">Test</h1>
      <h1>Test</h1>
    </div>
  );
}
