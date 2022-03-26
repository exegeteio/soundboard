// src/_includes/components/auth.jsx

import React, { useState, useEffect } from "react";

import { supabase } from "../../../lib/supabaseClient";

export default function Auth() {
  const [user, setUserState] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();

    if (session) {
      setUserState(session.user);
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUserState(session?.user);
        console.debug("Signed in as:", session?.user);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, [supabase]);

  const signIn = () => {
    supabase.auth.signIn({ provider: "twitch" });
  };

  const signOut = async () => {
    supabase.auth.signOut();
  };

  return (
    <>
      {user && <img src={user.user_metadata.avatar_url} />}
      {!user && <button onClick={signIn}>Sign in with Twitch</button>}
      {user && <button onClick={signOut}>Sign Out</button>}
    </>
  );
}
