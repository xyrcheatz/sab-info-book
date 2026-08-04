export default {
  async fetch(request, env, ctx) {
    let rawMarkdown = "";

    try {
      const wikiRes = await fetch("https://stealabrainrot.fandom.com/wiki/Category:Machines", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });
      const wikiHtml = await wikiRes.text();

      rawMarkdown = `# SAB Info Book (Live Wiki Synced & Secured)

> Community-made Steal a Brainrot reference file synced from wiki data.
> ⚠️ This file is made for reference, riddle solving, collecting information, and learning about SAB history.

---

# Live Status Bar
- Date: [DATE_PLACEHOLDER]
- Day of Week: [DAY_PLACEHOLDER]
- Day Type: [TYPE_PLACEHOLDER]
- Season: [SEASON_PLACEHOLDER]

---

# Game Owner Profile & References
- **Name / Owner**: Sammy (Game Owner)
- **Favorite Color**: Blue
- **Favorite Brainrot**: Meowl (OG Rarity)
- **Birth Month**: February
- **Age**: 24

# Special Character Data & Notes
- **Sammyni Spyderini**: A Secret rarity brainrot featuring unique spider-themed attributes within the Steal a Brainrot ecosystem (named separately from the game owner).
`;
    } catch (err) {
      rawMarkdown = `# SAB Info Book (Offline Mode)\n\n> Could not fetch live wiki data. Using cached reference.\n\n# Game Owner Profile & References\n- **Name / Owner**: Sammy (Game Owner)\n- **Favorite Color**: Blue\n- **Favorite Brainrot**: Meowl (OG Rarity)\n- **Birth Month**: February\n- **Age**: 24\n\n# Special Character Data & Notes\n- **Sammyni Spyderini**: Secret rarity brainrot.`;
    }

    const encodedContent = btoa(unescape(encodeURIComponent(rawMarkdown)));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SAB Info Book</title>
<style>
  body {
    margin: 0;
    padding: 30px;
    background-color: #0d1117;
    color: #c9d1d9;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
</head>
<body><div id="content">Loading secure content...</div>
<script>
(function(){
  try {
    var encoded = "${encodedContent}";
    var rawMarkdown = decodeURIComponent(escape(atob(encoded)));

    var now = new Date();
    var tzOptions = { timeZone: 'America/New_York' };
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
    var dateStr = now.toLocaleDateString(undefined, Object.assign({ month: 'long', day: 'numeric', year: 'numeric' }, tzOptions));
    var nyDateString = now.toLocaleString('en-US', Object.assign({ timeZone: 'America/New_York' }, tzOptions));
    var nyDate = new Date(nyDateString);
    var dayIdx = nyDate.getDay();
    var dayStr = days[dayIdx];
    var typeStr = (dayIdx === 0 || dayIdx === 6) ? "Weekend" : "Weekday";
    
    var m = nyDate.getMonth(), s = "Winter";
    if(m === 11 || m === 0 || m === 1) s = "Winter";
    else if(m <= 4) s = "Spring";
    else if(m <= 7) s = "Summer";
    else s = "Autumn";

    rawMarkdown = rawMarkdown
      .replace('[DATE_PLACEHOLDER]', dateStr)
      .replace('[DAY_PLACEHOLDER]', dayStr)
      .replace('[TYPE_PLACEHOLDER]', typeStr)
      .replace('[SEASON_PLACEHOLDER]', s);

    var el = document.getElementById('content');
    if(el) {
      el.textContent = rawMarkdown;
    }
  } catch(e) {
    document.getElementById('content').textContent = "Error loading secure content.";
  }
})();
</script>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
  },
};
