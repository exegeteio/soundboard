// src/_includes/components/auth_enabled.jsx

import { getProfile } from "../../../lib/profileRepository";
import { getUser, signIn } from "../../../lib/supabase";
import Sounds from "./sounds";
import Upload from "./upload";

export default function AuthEnabled({ props }) {
  const profile = getProfile();
  const user = getUser();

  return (
    <>
      {!user && <button onClick={signIn}>Sign in with Twitch</button>}
      {user && <Sounds />}
      {user && profile.enabled && (
        <>
          <hr />
          <Upload />
        </>
      )}
      {user && !profile.enabled && (
        <div>
          <p>You are not authorized to use this application.</p>
          <a
            className="button"
            href="mailto:nicest-select-0d@icloud.com?subject=Soundboard Access Request"
          >
            Request Access
          </a>
        </div>
      )}
    </>
  );
}
