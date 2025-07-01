import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

export default function PetFormBtn({
  actionType,
}: {
  actionType: "add" | "edit";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-6 self-end" disabled={pending}>
      {actionType === "add" ? "Add a new pet" : "Edit"}
    </Button>
  );
}
