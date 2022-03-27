// src/_includes/components/auth.jsx

import { useState, useEffect } from "react";

import { supabase } from "../../../lib/supabaseClient";
import { getSession } from "../../../lib/supabase";

const signIn = () => {
  supabase.auth.signIn({ provider: "twitch" });
};

const signOut = async () => {
  supabase.auth.signOut();
};

export default function Auth() {
  const session = getSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(session?.user || null);
  }, [session]);

  return (
    <>
      {user && <img src={user.user_metadata.avatar_url} />}
      {!user && <button onClick={signIn}>Sign in with Twitch</button>}
      {user && <button onClick={signOut}>Sign Out</button>}
    </>
  );
}
