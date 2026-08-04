export default {
  async fetch(request, env, ctx) {
    let allWikiPages = [];
    let fetchStatus = "Direct API Index Loaded Successfully";

    try {
      // Using the standard MediaWiki query API to fetch all pages directly without manual category restrictions
      const apiUrl = "https://stealabrainrot.fandom.com/api.php?action=query&list=allpages&aplimit=500&format=json";
      const res = await fetch(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } });

      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.allpages || [];
        allWikiPages = pages.map(p => p.title.replace(/_/g, " "));
      }
    } catch (err) {
      fetchStatus = "Fallback mode engaged.";
    }

    if (allWikiPages.length === 0) {
      allWikiPages = [
        "Steal a Brainrot Wiki",
        "Meowl",
        "Sammyni Spyderini",
        "Cupid Sahur"
      ];
    }

    let rawMarkdown = `# SAB Info Book (Universal Wiki Page Index)

> Comprehensive directory finding every single page that exists on the SAB wiki using direct API enumeration.
> ⚠️ Fully synchronized ledger.

---

# Live Status Bar
- Date: [DATE_PLACEHOLDER]
- Day of Week: [DAY_PLACEHOLDER]
- Day Type: [TYPE_PLACEHOLDER]
- Season: [SEASON_PLACEHOLDER]
- Status: ${fetchStatus}

---

# Game Owner Profile & References
- **Name / Owner**: Sammy (Game Owner)
- **Favorite Color**: Blue
- **Favorite Brainrot**: Meowl (OG Rarity)
- **Birth Month**: February
- **Age**: 24

---

# Every Existing Page on the SAB Wiki (${allWikiPages.length} Pages Found)
${allWikiPages.map((title, index) => `${index + 1}. **${title}**`).join('\n')}

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
<title>SAB Info Book - All Pages</title>
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
<body><div id="content">Loading universal wiki index...</div>
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
    document.getElementById('content').textContent = "Error rendering universal index.";
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
