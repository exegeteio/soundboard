// src/_includes/components/auth.jsx

import { getUser, signIn, signOut } from "../../../lib/supabase";

export default function Auth() {
  const user = getUser();

  return (
    <>
      {user && <img src={user.user_metadata.avatar_url} />}
      {!user && <button onClick={signIn}>Sign in with Twitch</button>}
      {user && <button onClick={signOut}>Sign Out</button>}
    </>
  );
}
