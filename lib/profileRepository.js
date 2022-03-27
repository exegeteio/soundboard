import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { getSession } from "./supabase";

export function getProfile() {
  const [profile, setProfile] = useState({});
  const session = getSession();

  useEffect(() => {
    const listener = supabase
      .from("profiles")
      .on("*", (payload) => {
        setProfile(payload.new);
      })
      .subscribe();

    supabase
      .from("profiles")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error getting profile data", error);
          alert(`Error getting sounds list: ${error.message}`);
        }

        if (data.length > 0) {
          setProfile(data[0]);
        } else {
          setProfile({});
        }
      })
      .catch((error) => {
        console.error(error);
        alert(`Error retrieving sounds: ${error.message}`);
      });

    return () => {
      supabase.removeSubscription(listener);
    };
  }, [supabase, session]);

  return profile;
}
