import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../public/logo.svg";

export default function Logo() {
  return (
    <Link href="/">
      <Image src={logo} alt="PetSoft" />
    </Link>
  );
}
