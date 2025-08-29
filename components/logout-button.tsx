"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();

    router.push("/auth/login");

  };

  return (
    <>
      <Button className="bg-percussion cursor-pointer text-white border border-blue-500 px-4 py-1 rounded hover:bg-white hover:text-percussion transition" onClick={logout}>
        <FontAwesomeIcon icon={faSignOut} className="mr-1" />Logout
      </Button>
    </>
  );
}
