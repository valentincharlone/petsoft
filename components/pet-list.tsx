"use client";

import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useMemo } from "react";

export default function PetList() {
  const { pets, handleChangeSelectedPetId, selectedPetId } = usePetContext();
  const { searchQuery } = useSearchContext();

  const filteredPets = useMemo(
    () =>
      pets.filter((pet) => pet.name.toLocaleLowerCase().includes(searchQuery)),
    [pets, searchQuery]
  );

  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleChangeSelectedPetId(pet.id)}
            className={cn(
              "flex items-center gap-2 h-[70px] w-full cursor-pointer px-5 text-base hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition",
              {
                "bg-[#eff1f2]": selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
