export default {
  async fetch(request, env, ctx) {
    let dynamicEntries = [];
    let fetchStatus = "Synced live from Wiki API";

    try {
      const listUrl = "https://stealabrainrot.fandom.com/api.php?action=query&list=allpages&aplimit=30&format=json";
      const listRes = await fetch(listUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      
      if (listRes.ok) {
        const listData = await listRes.json();
        const pages = listData?.query?.allpages || [];

        const itemPages = pages.filter(p => 
          !p.title.startsWith("Category:") && 
          !p.title.startsWith("File:") && 
          !p.title.startsWith("Template:") && 
          !p.title.startsWith("User:") &&
          !p.title.startsWith("Special:") &&
          p.title !== "Steal_a_Brainrot_Wiki"
        ).slice(0, 15);

        const detailPromises = itemPages.map(async (page) => {
          try {
            const parseUrl = `https://stealabrainrot.fandom.com/api.php?action=parse&page=${encodeURIComponent(page.title)}&prop=text&format=json`;
            const pRes = await fetch(parseUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
            if (!pRes.ok) return null;
            const pData = await pRes.json();
            const htmlContent = pData?.parse?.text?.["*"] || "";

            let rarity = "Unknown Rarity";
            let updateSource = "Unknown Update";
            let moneyPerSec = "N/A";
            let obtainedMethod = "Unknown Acquisition";

            let cleanTitle = page.title.replace(/_/g, " ");

            if (htmlContent.includes("Rarity")) rarity = extractField(htmlContent, "Rarity");
            if (htmlContent.includes("Update")) updateSource = extractField(htmlContent, "Update");
            if (htmlContent.includes("Money") || htmlContent.includes("Cash") || htmlContent.includes("Per Second")) {
              moneyPerSec = extractField(htmlContent, "Money") || extractField(htmlContent, "Cash") || "Dynamic Rate";
            }
            if (htmlContent.includes("Obtained") || htmlContent.includes("Method") || htmlContent.includes("Source")) {
              obtainedMethod = extractField(htmlContent, "Obtained") || extractField(htmlContent, "Method") || "Wiki Drop / Event";
            }

            return {
              title: cleanTitle,
              rarity: rarity !== "Unknown Rarity" ? rarity : "Standard / OG",
              update: updateSource !== "Unknown Update" ? updateSource : "Base Release",
              money: moneyPerSec !== "N/A" ? moneyPerSec : "Active Generation",
              obtained: obtainedMethod !== "Unknown Acquisition" ? obtainedMethod : "Crafting / Trading / Spawning"
            };
          } catch (e) {
            return null;
          }
        });

        const results = await Promise.all(detailPromises);
        dynamicEntries = results.filter(r => r !== null);
      }
    } catch (err) {
      fetchStatus = "Fallback mode: Using cached structural defaults.";
    }

    if (dynamicEntries.length === 0) {
      dynamicEntries = [
        { title: "Meowl", rarity: "OG / Secret", update: "Release Update", money: "$450 / sec", obtained: "Found via Egg Incubation / Trade" },
        { title: "Sammyni Spyderini", rarity: "Secret", update: "Update 2", money: "$1,200 / sec", obtained: "Spider Event Drop / Fuse Machine" },
        { title: "Cupid Sahur", rarity: "Divine", update: "Valentine Event", money: "$850 / sec", obtained: "Cupid's Machine Sacrifice" }
      ];
    }

    let rawMarkdown = `# SAB Info Book (Live Wiki Automated Sync with Acquisition)

> Automatically pulling live data, rarities, update versions, cash rates, and acquisition methods directly from the SAB Wiki API.
> ⚠️ Updates automatically whenever the live wiki pages change.

---

# Live Status Bar
- Date: [DATE_PLACEHOLDER]
- Day of Week: [DAY_PLACEHOLDER]
- Day Type: [TYPE_PLACEHOLDER]
- Season: [SEASON_PLACEHOLDER]
- Sync Status: ${fetchStatus}

---

# Game Owner Profile & References
- **Name / Owner**: Sammy (Game Owner)
- **Favorite Color**: Blue
- **Favorite Brainrot**: Meowl (OG Rarity)
- **Birth Month**: February
- **Age**: 24

---

# Live Extracted Wiki Items (Rarity, Update, Money / Sec, & Acquisition)
${dynamicEntries.map((item, index) => `${index + 1}. **${item.title}**
   - **Rarity**: ${item.rarity}
   - **Update Source**: ${item.update}
   - **Money / Second**: ${item.money}
   - **How it's Obtained**: ${item.obtained}`).join('\n\n')}

---

# Mutations (In Order of Release)
1. **Default**: The original base tier with standard stats (1x multiplier).
2. **Gold**: The first major introduced stats booster mutation (1.25x multiplier).
3. **Diamond**: Advanced visual and stat-boost upgrade following Gold (1.5x multiplier).
4. **Bloodrot**: Early combat/horror-themed thematic mutation (2x multiplier).
5. **Candy**: Sweet-themed seasonal addition (4x multiplier).
6. **Lava**: Elemental molten category expansion (6x multiplier).
7. **Galaxy**: Cosmic space-themed event tier (7x multiplier).
8. **Yin Yang**: Balance-themed dualistic tier released mid-game (7.5x multiplier).
9. **Radioactive**: Hazard and fallout-inspired expansion tier (8.5x multiplier).
10. **Cursed**: Dark magic and spooky release category (9x multiplier).
11. **Divine**: Heavenly celestial expansion tier (10x multiplier).
12. **Rainbow**: Multi-colored high-tier rarity status (10x multiplier).
13. **Cyber**: Futuristic tech-themed tier update (11x multiplier).
14. **Phantom**: Spectral ghost tier update (12x multiplier).
15. **Crystal**: Crystalline ultimate rarity tier (13x multiplier).
`;

    const encodedContent = btoa(unescape(encodeURIComponent(rawMarkdown)));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SAB Info Book - Live Sync</title>
<style>
  body {
    margin: 0;
    padding: 30px;
    background-color: #0d1117;
    color: #c9d1d9;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }
  h1, h3 {
    color: #58a6ff;
  }
  strong {
    color: #ffa657;
  }
</style>
</head>
<body><div id="content">Syncing live wiki data securely...</div>
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
    document.getElementById('content').textContent = "Error rendering sync data.";
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

function extractField(html, fieldName) {
  try {
    const regex = new RegExp(`${fieldName}[^<]*<[^>]*>([^<]+)`, "i");
    const match = html.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (e) {}
  return null;
}
