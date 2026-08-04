# SAB Info Book (Cloudflare Worker & Static Site)

A community-made *Steal a Brainrot* reference and info book web application built to run on Cloudflare Workers. It dynamically syncs with wiki data, handles timezone calculations (EST), obscures its core contents from direct DOM inspection, and tracks game owner details.

## Features
- **Live Status Bar**: Dynamically shows the current Date, Day of the Week, Day Type (Weekday/Weekend), and Season adjusted for **EST (America/New_York)**.
- **Secure Content Obfuscation**: Base64-encodes and decodes the markdown content via JavaScript at runtime to prevent casual static inspection in browser DOM viewers.
- **Dynamic Wiki Sync**: Connects to the Steal a Brainrot Fandom wiki.
- **Owner & Reference Data**: Includes dedicated data tracking for game owner Sammy and related brainrots.

## Deployment
This project is configured as a Cloudflare Worker JavaScript module (`index.js`). 

To deploy using Wrangler:
```bash
npm install -g wrangler
wrangler login
wrangler deploy
