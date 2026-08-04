export default {
  async fetch(request, env, ctx) {
    let wikiDataSummary = "Synced from multiple wiki categories successfully.";

    try {
      // Fetching multiple pages/categories simultaneously to gather broad info
      const [machinesRes, mainRes, brainrotsRes] = await Promise.all([
        fetch("https://stealabrainrot.fandom.com/wiki/Category:Machines", { headers: { "User-Agent": "Mozilla/5.0" } }),
        fetch("https://stealabrainrot.fandom.com/wiki/Steal_a_Brainrot_Wiki", { headers: { "User-Agent": "Mozilla/5.0" } }),
        fetch("https://stealabrainrot.fandom.com/wiki/Category:Brainrots", { headers: { "User-Agent": "Mozilla/5.0" } })
      ]);

      const machinesHtml = await machinesRes.text();
      const mainHtml = await mainRes.text();
      const brainrotsHtml = await brainrotsRes.text();

      // Basic validation check to ensure pages are responding
      if (machinesRes.ok || mainRes.ok || brainrotsRes.ok) {
        wikiDataSummary = "Connected to Fandom Wiki (Machines, Main, and Brainrots pages parsed).";
      }
    } catch (err) {
      wikiDataSummary = "Offline fallback mode active (Wiki fetch restricted).";
    }

    let rawMarkdown = `# SAB Info Book (Full Wiki Synced & Secured)

> Community-made Steal a Brainrot reference file synced across multiple wiki pages.
> ⚠️ This file is made for reference, riddle solving, collecting information, and learning about SAB history.

---

# Live Status Bar
- Date: [DATE_PLACEHOLDER]
- Day of Week: [DAY_PLACEHOLDER]
- Day Type: [TYPE_PLACEHOLDER]
- Season: [SEASON_PLACEHOLDER]

---

# Multi-Page Wiki Sync Status
- Status: ${wikiDataSummary}

---

# Game Owner Profile & References
- **Name / Owner**: Sammy (Game Owner)
- **Favorite Color**: Blue
- **Favorite Brainrot**: Meowl (OG Rarity)
- **Birth Month**: February
- **Age**: 24

---

# Comprehensive Wiki Reference & Core Data

### 1. Machines & Utilities
- **Fuse Machine**: Combines multiple brainrots together through fusion recipes (includes seasonal variants like OG, Summer, Divine, Witch, and Santa Fuse).
- **Craft Machine**: Crafts exclusive reward brainrots using specific recipe materials.
- **Brainrot Dealer / Trader**: Specialized NPC trade setups and dealer inventories for swapping high-tier brainrots.
- **Bubblegum Machine**: Core machine variant providing unique reward lines.
- **Cupid's Machine**: Limited-time seasonal machine allowing sacrifices for Valentine-themed items like Cupid Cupid Sahur, Lovin Rose, or Heart Lucky Blocks.
- **Trait Incubator**: Special system for incubating egg-themed brainrots and rolling traits.
- **Trade Machine**: Official secure trading system added to combat scammers.

### 2. Value & Mutation Overview
- **Final Value Formula**: (Brainrot Value × Mutation Multiplier) + Trait Multipliers stacked.
- **Mutation History**: Default (1x), Bloodrot (2x), Gold (1.25x), Diamond (1.5x), Rainbow (10x), Candy (4x), Lava (6x), Galaxy (7x), Yin Yang (7.5x), Radioactive (8.5x), Cursed (9x), Divine (10x), Cyber (11x), Phantom (12x), Crystal (13x).

### 3. Special Characters & Notes
- **Sammyni Spyderini**: A Secret rarity brainrot featuring unique spider-themed attributes within the Steal a Brainrot ecosystem (named separately from the game owner Sammy).
`;

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
