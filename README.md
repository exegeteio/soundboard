# Soundboard

Personal app to explore Supabase as a backend provider.

## Setup

Copy `.env-sample` to `.env` and add your Supabase URL and **Anon** key (Not
the one marked secret!).

### Supabase Setup

You will want to enable Row-Level-Security (RLS) in your Supabase instance.

This app relies on three tables:

- Supabase Auth `users` table.
- `profiles` - Only uses the `enabled` column to enable users.
  - Enabling users is a manual task.
  - RLS should allow users to `SELECT` only their own profile.
- `soundboard` - Label, file extension, and user info for a specific sound.
  - RLS should allow users to `INSERT`, `SELECT` and `DELETE` their records.
  - Restrict `INSERT` to only users `enabled` in their profile.

Also uses a bucket named `soundboard`. This should have RLS as well:

- Allow users to `SELECT` and `DELETE` any file in their own folder, regardless
  of `enabled`.
- Allow users to `INSERT` into their own folder, but only if they are `enabled`.

## Deployment

Output is static files, but the environment variables need to exist in your build environment in
order to populate the Supabase settings. So using Netlify (or similar), you'll need to set those
variables prior to deployment.
