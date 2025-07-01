"use client";

import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addPet, editPet } from "@/actions/actions";
import PetFormBtn from "./pet-form-btn";
import { toast } from "sonner";
import { usePetContext } from "@/lib/hooks";

type PetFormProps = {
  actionType: "edit" | "add";
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet } = usePetContext();

  const handleSubmit = async (formData: FormData) => {
    if (actionType === "add") {
      const response = await addPet(formData);
      if (response) {
        toast.warning(response.message);
        return;
      }
    } else if (actionType === "edit") {
      const response = await editPet(selectedPet?.id, formData);
      if (response) {
        toast.warning(response.message);
        return;
      }
    }
    onFormSubmission();
  };

  return (
    <form action={handleSubmit} className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            defaultValue={actionType === "edit" ? selectedPet?.age : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
          />
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
