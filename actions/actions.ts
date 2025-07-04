"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// -- user actions --

export async function logIn(formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }
  await signIn("credentials", formData);
  redirect("/app/dashboard");
}

export async function signUp(formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }
  const formDataObj = Object.fromEntries(formData.entries());

  const validateFormData = authSchema.safeParse(formDataObj);
  if (!validateFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const { email, password } = validateFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }
    return {
      message: "Could not create user.",
    };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// -- pet actions --

export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user?.id,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: string, newPetData: PetEssentials) {
  await sleep(1000);
  const session = await checkAuth();

  const validatePet = petFormSchema.safeParse(newPetData);
  if (!validatePet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  const pet = await getPetById(petId);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user?.id) {
    return {
      message: "You are not the owner of this pet.",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: validatePet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: string) {
  await sleep(1000);

  const session = await checkAuth();

  const pet = await getPetById(petId);
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user?.id) {
    return {
      message: "You are not the owner of this pet.",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
        user: {
          id: session.user.id,
        },
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }
  revalidatePath("/app", "layout");
}
