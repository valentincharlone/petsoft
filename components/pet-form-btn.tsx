import React from "react";
import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button type="submit" className="mt-6 self-end">
      {actionType === "add" ? "Add a new pet" : "Edit"}
    </Button>
  );
}
