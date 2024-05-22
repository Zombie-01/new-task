"use client";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="w-screen bg-gray-900  text-white py-4">
      <div className=" container m-auto flex justify-between items-center font-medium  ">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Your Landing Page Title</h1>
          <p className="mt-2">Welcome to your awesome landing page!</p>
        </div>
        <div className="flex items-center gap-10 text-xl">
          <Link href="/">Home page</Link>
          <Link href="/diploma">Diploma</Link>
          {/* {localStorage && localStorage?.getItem("role") && (
            <Link href="/process">Process</Link>
          )}{" "} */}
          <Link href="/login">login</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
