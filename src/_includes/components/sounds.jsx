// src/_includes/components/sounds.jsx

import React, { useState, useEffect } from "react";

import { supabase } from "../../../lib/supabaseClient";

const getSoundUrl = (sound) => {
  const url = `${sound.user_id}/${sound.id}.${sound.extension}`;
  const { publicURL, error } = supabase.storage
    .from("uploads")
    .getPublicUrl(url);
  if (error) {
    console.error("Error retrieving publicURL", error);
    alert(`Error retrieving public url: ${error.message}`);
  }
  return publicURL;
};

const reset = () => {
  var audios = document.getElementsByTagName("audio");
  for (var i = 0; i < audios.length; i++) {
    audios[i].parentNode.removeChild(audios[i]);
  }
};

const play = (sound) => {
  const url = getSoundUrl(sound);
  reset();
  const audio = new Audio(url);
  audio.src = url;
  audio.autoplay = true;
  audio.id = true;
  console.debug(`Playing "${sound.label}"`);
  document.body.appendChild(audio);
};

const deleteSound = async (sound) => {
  const { data: storageData, error: storageError } = await supabase.storage
    .from("uploads")
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
};

export default function Sounds() {
  const [sounds, setSounds] = useState({ records: [] });
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
        console.debug("Initial Load", data, error);
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
  }, [supabase]);

  return (
    <ul id="sounds">
      <li className="stop-sound">
        <span>Stop all Sounds</span>
        <a
          href="#"
          onClick={(e) => {
            reset();
          }}
        >
          ⏹
        </a>
      </li>
      {sounds.records.map((sound, index) => {
        return (
          <li key={index} id="sound-{sound.id}">
            <span>{sound.label}</span>
            <a
              href="#"
              onClick={(e) => {
                play(sound);
              }}
            >
              ▶️
            </a>
            <a
              href="#"
              onClick={(e) => {
                const el = document.getElementById(sound.id);
                el.focus();
                el.select();
                try {
                  document.execCommand("copy");
                  alert("Copied to clipboard!");
                } catch (err) {
                  alert("Error copying to clipboard");
                }
              }}
            >
              🔗
            </a>
            <input
              type="text"
              id={sound.id}
              defaultValue={getSoundUrl(sound)}
            />
            <a
              href="#"
              onClick={(e) => {
                if (confirm(`Delete "${sound.label}"?  This is permanent!`)) {
                  deleteSound(sound);
                }
              }}
            >
              🗑
            </a>
          </li>
        );
      })}
    </ul>
  );
}
