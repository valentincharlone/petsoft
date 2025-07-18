"use server";

import { signIn, signOut } from "@/lib/auth-no-edge";
import prisma from "@/lib/db";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { PetEssentials } from "@/lib/types";
import { authSchema, petFormSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// -- user actions --

export async function logIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials.",
          };
        }
        default: {
          return {
            message: "Error. Could not sign in.",
          };
        }
      }
    }

    throw error;
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
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

// -- payment actions --

export async function createCheckoutSession() {
  try {
    const session = await checkAuth();

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price: "price_1RiEI74ISXJs2sChofaSM1Q0",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
      cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
    });

    redirect(checkoutSession.url);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
