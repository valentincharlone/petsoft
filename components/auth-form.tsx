import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AuthForm({ type }: { type: "logIn" | "signUp" }) {
  return (
    <form action="">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="border-zinc-400" />
      </div>
      <div className="mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" className="border-zinc-400" />
      </div>

      <Button className="mt-4">
        {type === "logIn" ? "Log In" : "Sign Up"}
      </Button>
    </form>
  );
}
