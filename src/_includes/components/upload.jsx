// src/_includes/components/auth.jsx

import React, { useReducer, useState, useEffect } from "react";

import { supabase } from "../../../lib/supabaseClient";

export default function Upload() {
  const [inputs, setInputs] = useState({});
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();

    if (session) {
      setInputs({ ...inputs, user_id: session.user.id });
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setInputs({ ...inputs, user_id: session?.user.id });
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, [supabase]);

  const fileChanged = (input) => {
    const [file, extension] = input.files[0].name.split(".");
    setInputs({ ...inputs, file: input.files[0], extension: extension });
  };

  const upload = async (e) => {
    setDisabled(true);
    e.preventDefault();
    if (!inputs.label) {
      alert("Must enter a label.");
      setDisabled(false);
      return;
    }

    const { data: insertData, error: insertError } = await supabase
      .from("soundboard")
      .insert({
        label: inputs.label,
        user_id: inputs.user_id,
        extension: inputs.extension,
      });

    if (insertError) {
      console.error(insertError);
      alert(`Error inserting record: ${insertError.message}`);
      setDisabled(false);
      return;
    }

    const uploadPath = `${inputs.user_id}/${insertData[0].id}.${inputs.extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(uploadPath, inputs.file);

    if (uploadError) {
      console.error(uploadError);
      alert(`Error uploading file: ${uploadError.message}`);
      setDisabled(false);
      return;
    }
    // Reset the form.
    e.target.reset();
    setDisabled(false);
    alert("Upload complete!");
  };

  return (
    <form onSubmit={upload} disabled={disabled}>
      <fieldset>
        <input
          type="file"
          name="upload_file"
          onChange={(e) => fileChanged(e.target)}
        />
        <label htmlFor="upload_label">Label</label>
        <input
          type="text"
          name="upload_label"
          onChange={(e) => setInputs({ ...inputs, label: e.target.value })}
        />
        <button disabled={disabled}>Upload!</button>
      </fieldset>
    </form>
  );
}
