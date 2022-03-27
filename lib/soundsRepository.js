import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { getSession } from "./supabase";

export function allSounds() {
  const [sounds, setSounds] = useState({ records: [] });
  const session = getSession();

  useEffect(() => {
    const listener = supabase
      .from("soundboard")
      .on("*", (payload) => {
        console.log("Received payload", payload);
        switch (payload.eventType) {
          case "INSERT":
            setSounds((prev) => ({ records: [...prev.records, payload.new] }));
            break;
          case "DELETE":
            console.log("DELETE", payload);
            setSounds((prev) => ({
              records: [
                ...prev.records.filter(
                  (record) => record.id !== payload.old.id
                ),
              ],
            }));
            break;
          default:
            console.log("Received payload", payload);
        }
      })
      .subscribe();

    supabase
      .from("soundboard")
      .select("*")
      .then(({ data, error }) => {
        console.debug("Data Load", data, error);
        if (error) {
          console.error("Error getting initial data", error);
          alert(`Error getting sounds list: ${error.message}`);
        }

        setSounds({ records: data });
      })
      .catch((error) => {
        console.error(error);
        alert(`Error retrieving sounds: ${error.message}`);
      });

    return () => {
      supabase.removeSubscription(listener);
    };
  }, [supabase, session]);

  return sounds;
}

export async function deleteSound(sound) {
  const { data: storageData, error: storageError } = await supabase.storage
    .from("soundboard")
    .remove([getSoundUrl(sound)]);
  if (storageError) {
    console.error(storageError);
    alert(`Error deleting sound file: ${storageError.message}`);
    return;
  }

  // delete record from supabase.
  const { data: recordData, error: recordError } = await supabase
    .from("soundboard")
    .delete()
    .match({ id: sound.id });
  if (recordError) {
    console.error(recordError);
    alert(`Error deleting record: ${recordError.message}`);
  }

  alert("Deleted!");
}
