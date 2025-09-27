import { createClient } from "@/lib/supabase/client";
import { User } from "../app/utils/types"

const supabase = createClient();

export const getInitialSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const { data: userData } = await supabase.from("users").select("*")
        .eq("email", session.user?.email).single() as { data: User };
      return userData
    } else {
      return null;
    }
  };