import { supabase } from "./supabaseClient";

export function getSoundUrl(sound) {
  const url = `${sound.user_id}/${sound.id}.${sound.extension}`;
  const { publicURL, error } = supabase.storage
    .from("soundboard")
    .getPublicUrl(url);
  if (error) {
    console.error("Error retrieving publicURL", error);
    alert(`Error retrieving public url: ${error.message}`);
  }
  return publicURL;
}
