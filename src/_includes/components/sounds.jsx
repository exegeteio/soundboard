// src/_includes/components/sounds.jsx

import React, { useState, useEffect } from "react";

import { getSoundUrl } from "../../../lib/sounds";
import { allSounds, deleteSound } from "../../../lib/soundsRepository";
import { getProfile } from "../../../lib/profileRepository";

export default function Sounds() {
  const [playing, setPlaying] = useState(null);
  const sounds = allSounds();
  const profile = getProfile();

  return (
    <>
      {sounds.records.length > 0 && (
        <ul id="sounds" className={profile.enabled?.toString() || "enabled"}>
          {sounds.records.map((sound, index) => {
            return (
              <li key={index} id="sound-{sound.id}">
                <span>{sound.label}</span>
                {!playing && (
                  <a
                    href="#"
                    className="play"
                    onClick={(e) => {
                      e.preventDefault();
                      setPlaying(sound);
                    }}
                  >
                    ▶️
                  </a>
                )}
                {playing && (
                  <a
                    href="#"
                    className="stop"
                    onClick={(e) => {
                      e.preventDefault();
                      setPlaying(null);
                    }}
                  >
                    ⏹
                  </a>
                )}
                <a
                  href="#"
                  className="copy"
                  onClick={(e) => {
                    e.preventDefault();
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
                    e.preventDefault();
                    if (
                      confirm(`Delete "${sound.label}"?  This is permanent!`)
                    ) {
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
      )}
      {playing && (
        <audio autoPlay onEnded={() => setPlaying(null)}>
          <source src={getSoundUrl(playing)} type="audio/mp3" />
        </audio>
      )}
    </>
  );
}
