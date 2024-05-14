"use client";

import Image from "next/image";
import InstallButton from "./installButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./header";
import { useRouter } from "next/navigation";

const cards = [
  {
    title: "Feature 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imageUrl: "/images/feature1.jpg"
  },
  {
    title: "Feature 2",
    description: "Nulla in ligula ut justo tempus faucibus ut ut felis.",
    imageUrl: "/images/feature2.jpg"
  },
  {
    title: "Feature 3",
    description:
      "Sed lacinia nulla ac nisi tempor, eget lacinia enim interdum.",
    imageUrl: "/images/feature3.jpg"
  }
];

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        // Redirect to /diploma?search=searchText
        router.push(`/diploma?search=${searchText}`);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchText, router]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <Header />

      <section className="py-12 bg-gray-100 px-10 m-auto container">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div>
              <h2 className="text-2xl font-semibold">Discover Our Product</h2>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                in ligula ut justo tempus faucibus ut ut felis.
              </p>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Enter search text and press Enter..."
                className="mt-4 p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <img src="/sec.png" alt="Product" className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={card?.imageUrl}
                  alt={card?.title}
                  className="w-full h-40 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{card?.title}</h3>
                  <p className="mt-2">{card?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
