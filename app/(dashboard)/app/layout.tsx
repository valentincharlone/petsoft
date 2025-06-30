import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";
import { Pet } from "@/lib/types";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await fetch(
    "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  );
  const pets: Pet[] = await res.json();

  return (
    <>
      <BackgroundPattern />
      <div className="flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />

        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>
    </>
  );
}
