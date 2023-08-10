import { Metadata } from "next";
import { redirect } from "next/navigation";
import { authOptions, getAuthSession } from "@/lib/auth";
import { UsernameForm } from "@/components/UsernameForm";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage account and website settings",
};

const SettingsPage = async () => {
  const session = await getAuthSession();

  if (!session) {
    redirect(authOptions.pages?.signIn || "/sing-in");
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
        <div className="grid gap-10">
          <UsernameForm
            user={{
              username: session.user.username || "",
              id: session.user.id,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
