# Soundboard

Personal app to explore Supabase as a backend provider. 

## Setup

Copy `.env-sample` to `.env` and add your Supabase URL and **Anon** key (Not the one marked
secret!).

## Deployment

Output is static files, but the environment variables need to exist in your build environment in
order to populate the Supabase settings.  So using Netlify (or similar), you'll need to set those
variables prior to deployment.

