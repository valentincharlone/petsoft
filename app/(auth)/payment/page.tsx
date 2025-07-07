"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransitionn] = useTransition();
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>Petsoft access required payment</H1>

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={() => {
            startTransitionn(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}
      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! Your now have lifetime access to PetSoft
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled. You can try again.
        </p>
      )}
    </main>
  );
}
