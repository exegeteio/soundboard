// src/_includes/components/sounds.jsx

import React, { useState, useEffect } from "react";

import { getSoundUrl } from "../../../lib/sounds";
import { allSounds, deleteSound } from "../../../lib/soundsRepository";

export default function Sounds() {
  const [playing, setPlaying] = useState(null);
  const sounds = allSounds();

  return (
    <>
      <ul id="sounds">
        <li className="stop-sound">
          <span>Stop all Sounds</span>
          <a
            href="#"
            onClick={(e) => {
              setPlaying(null);
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
                  setPlaying(sound);
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
      {playing && (
        <audio autoPlay>
          <source src={getSoundUrl(playing)} type="audio/mp3" />
        </audio>
      )}
    </>
  );
}
