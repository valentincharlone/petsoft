"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

export default function SignOutBtn() {
  const [isPendiing, startTransition] = useTransition();
  return (
    <Button
      disabled={isPendiing}
      onClick={() => {
        startTransition(async () => {
          await logOut();
        });
      }}
    >
      Sign out
    </Button>
  );
}
