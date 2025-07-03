import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import SignOutBtn from "@/components/sign-out-btn";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const userRequest = await auth();
  if (!userRequest?.user) {
    redirect("/login");
  }

  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>

      <ContentBlock className="h-[500px] flex flex-col gap-3 justify-center items-center">
        <p>Logged in as {userRequest?.user?.email}</p>
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
}
