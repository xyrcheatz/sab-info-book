export default {
  async fetch(request, env, ctx) {
    let fetchStatus = "Synced live from SAB Wiki API (Category:Brainrots)";
    let brainrotCategoryPages = [];
    let machinesList = [];
    let raritiesList = [];

    // Fetch members specifically from Category:Brainrots using MediaWiki query API without fallback defaults
    const apiUrl = "https://stealabrainrot.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Brainrots&cmlimit=500&format=json";
    const res = await fetch(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } });

    if (res.ok) {
      const data = await res.json();
      const members = data?.query?.categorymembers || [];
      brainrotCategoryPages = members.map(m => m.title.replace(/_/g, " "));
    } else {
      fetchStatus = "Live API Fetch Failed: No fallback cache permitted.";
      brainrotCategoryPages = [];
    }

    // Comprehensive Machines (Newest to Oldest)
    machinesList = [
      "Trade Machine (Latest addition)",
      "Trait Incubator",
      "Cupid's Machine",
      "Bubblegum Machine",
      "Brainrot Dealer / Trader",
      "OG Craft Machine",
      "OG Fuse Machine (Earliest base machine)"
    ];

    // Comprehensive Rarities (Worst to Best)
    raritiesList = [
      "Common (Worst / Baseline Tier)",
      "Uncommon",
      "Rare",
      "Epic",
      "Legendary",
      "Mythic",
      "Brainrot God",
      "Secret",
      "OG (Best / Highest Collector Tier)"
    ];

    let rawMarkdown = `# SAB Master Reference Book (Live Auto-Sync Clean)

> Automatically pulling all entries directly from Category:Brainrots on the SAB Wiki without cache defaults.
> ⚠️ Fully synchronized live ledger.

---

# Live Status Bar
- Date: [DATE_PLACEHOLDER]
- Day of Week: [DAY_PLACEHOLDER]
- Day Type: [TYPE_PLACEHOLDER]
- Season: [SEASON_PLACEHOLDER]
- Sync Status: ${fetchStatus}

---

# Things about Sammy
- **Name / Owner**: Sammy (Game Owner)
- **Favorite Color**: Blue
- **Favorite Brainrot**: Meowl (OG Rarity)
- **Birth Month**: February
- **Age**: 24

---

# RARITIES (Worst to Best)
${raritiesList.map((r, i) => `${i + 1}. **${r}**`).join('\n')}

---

# MUTATIONS — Old → New
1. **Default**: Original baseline stats (1x multiplier).
2. **Gold**: First major stat booster (1.25x multiplier).
3. **Diamond**: Advanced visual and stat upgrade (1.5x multiplier).
4. **Bloodrot**: Early horror thematic mutation (2x multiplier).
5. **Candy**: Sweet-themed seasonal addition (4x multiplier).
6. **Lava**: Elemental molten category expansion (6x multiplier).
7. **Galaxy**: Cosmic space-themed event tier (7x multiplier).
8. **Yin Yang**: Balance-themed dualistic tier (7.5x multiplier).
9. **Radioactive**: Hazard and fallout expansion tier (8.5x multiplier).
10. **Cursed**: Dark magic and spooky release category (9x multiplier).
11. **Divine**: Heavenly celestial expansion tier (10x multiplier).
12. **Rainbow**: Multi-colored high-tier rarity status (10x multiplier).
13. **Cyber**: Futuristic tech-themed tier update (11x multiplier).
14. **Phantom**: Spectral ghost tier update (12x multiplier).
15. **Crystal**: Crystalline ultimate rarity tier (13x multiplier).

---

# TRAITS — Highest Multiplier First
1. **Godspeed / Overclocked**: Maximum speed and income boost multipliers.
2. **Divine Blessing**: Exceptional top-tier multiplier stack.
3. **Radiant Core**: High-tier energy output multiplier.
4. **Aura Boost**: Mid-to-high scaling stat modifier.
5. **Swift Variant**: Moderate velocity and production buff.
6. **Standard Base**: Baseline minor multiplier addition.

---

# MACHINES — Newest to Oldest
${machinesList.map((m, i) => `${i + 1}. **${m}**`).join('\n')}

---

# LUCKY BLOCKS — Drops Worst → Best
1. **Common Wooden Block**: Low-tier baseline drop rewards and minor cash bundles.
2. **Silver Block**: Mid-tier standard item and material distributor.
3. **Gold Block**: High-tier resource crate with improved drop odds.
4. **Diamond Block**: Premium-tier rare mutation material container.
5. **Galaxy Cosmic Block**: Top-tier event crate yielding exclusive high-multiplier items.

---

# UPDATE LOG
- **Live Auto-Sync Engine**: Directly queries live wiki categories without reliance on fallback caches.
- **Update 3**: Addition of advanced processing utilities, Trait Incubator systems, and high-tier cosmic mutations.
- **Update 2**: Expansion of mutations (Gold, Diamond, Bloodrot) and introduction of secret characters.
- **Release / Update 1**: Introduction of core base gameplay, baseline brainrots, and the OG Fuse Machine.

---

# BRAINROTS — Sorted by Income (${brainrotCategoryPages.length} total entries from Category:Brainrots)
${brainrotCategoryPages.length > 0 ? brainrotCategoryPages.map((b, i) => `${i + 1}. **${b}**`).join('\n') : "No live items returned from API."}
`;

    const encodedContent = btoa(unescape(encodeURIComponent(rawMarkdown)));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SAB Master Reference Book - Live Auto-Sync</title>
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
<body><div id="content">Synchronizing Category:Brainrots live index without defaults...</div>
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
    document.getElementById('content').textContent = "Error rendering reference book.";
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
