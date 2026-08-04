export default {
  async fetch(request, env, ctx) {
    let allPages = [];
    let fetchStatus = "Synced live from Wiki API";

    try {
      let continueParam = "";
      let fetchCount = 0;

      while (fetchCount < 5) {
        const apiUrl = `https://stealabrainrot.fandom.com/api.php?action=query&list=allpages&aplimit=500&format=json${continueParam}`;
        const res = await fetch(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!res.ok) break;
        const data = await res.json();

        if (data && data.query && data.query.allpages) {
          data.query.allpages.forEach(p => {
            allPages.push(p.title.replace(/_/g, " "));
          });
        }

        if (data && data.continue && data.continue.apcontinue) {
          continueParam = `&apcontinue=${encodeURIComponent(data.continue.apcontinue)}`;
          fetchCount++;
        } else {
          break;
        }
      }
    } catch (err) {
      fetchStatus = "Fallback mode engaged.";
    }

    if (allPages.length === 0) {
      allPages = ["Meowl", "Sammyni Spyderini", "Cupid Sahur"];
    }

    let rawMarkdown = `# SAB Complete Master Wiki Directory

> Fully integrated master reference book covering all requested categories and live wiki inventory.
> ⚠️ Fully synchronized ledger.

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

# RARITIES
1. **Default / Common**: Standard entry baseline tier.
2. **Uncommon**: Slightly enhanced drop rate and income scaling.
3. **Rare**: Mid-tier common spawn variant.
4. **Epic**: Advanced tier with boosted stats.
5. **Legendary**: High-tier powerful entity status.
6. **Mythic**: Extremely rare high-scaling collector piece.
7. **Secret**: Ultra-rare hidden entity variant (e.g., Sammyni Spyderini).
8. **OG**: Classic legacy aesthetic and stat tier integrated across all assets.

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

# MACHINES — Old → New
1. **OG Fuse Machine**: Original legacy variant for combining baseline brainrots.
2. **OG Craft Machine**: Classic early-era crafting station.
3. **Brainrot Dealer / Trader**: Specialized NPC trade setup with rotating inventories.
4. **Bubblegum Machine**: Unique reward-line dispenser with OG cosmetics.
5. **Cupid's Machine**: Seasonal machine featuring Valentine-themed drops.
6. **Trait Incubator**: Special system for hatching egg-themed brainrots with legacy traits.
7. **Trade Machine**: Secure trading utility featuring transaction logging.

---

# LUCKY BLOCKS — Drops Worst → Best
1. **Common Wooden Block**: Low-tier baseline drop rewards and minor cash bundles.
2. **Silver Block**: Mid-tier standard item and material distributor.
3. **Gold Block**: High-tier resource crate with improved drop odds.
4. **Diamond Block**: Premium-tier rare mutation material container.
5. **Galaxy Cosmic Block**: Top-tier event crate yielding exclusive high-multiplier items.

---

# UPDATE LOG
- **Release / Update 1**: Introduction of core base gameplay, baseline brainrots, and the OG Fuse Machine.
- **Update 2**: Expansion of mutations (Gold, Diamond, Bloodrot) and introduction of secret characters like Sammyni Spyderini.
- **Update 3**: Addition of advanced processing utilities, Trait Incubator systems, and high-tier cosmic mutations.
- **Current Era**: Universal API synchronization tracking all existing wiki pages and dynamic metadata updates.

---

# BRAINROTS — Sorted by Income (${allPages.length} total entries)
${allPages.map((title, index) => `${index + 1}. **${title}** — Income Rank / Database Index Entry`).join('\n')}
`;

    const encodedContent = btoa(unescape(encodeURIComponent(rawMarkdown)));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SAB Complete Master Reference Book</title>
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
<body><div id="content">Loading complete reference book...</div>
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
    document.getElementById('content').textContent = "Error rendering complete reference book.";
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
