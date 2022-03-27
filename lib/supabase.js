import { useState, useEffect } from "react";

import { supabase } from "./supabaseClient";

export function getSession() {
  const [sessionState, setSessionState] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();

    if (session) {
      setSessionState(session);
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSessionState(session || null);
        console.debug("Signed in as:", session?.user);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, [supabase]);

  return sessionState;
}
