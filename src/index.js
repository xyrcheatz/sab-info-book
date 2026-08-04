export default {
  async fetch(request, env, ctx) {
    let rarities = ["Common", "Rare", "Epic", "Legendary", "Mythic", "Brainrot_God", "Secret", "OG"];
    let rarityMap = {};
    let brainrotEntries = [];

    for (let r of rarities) {
      let cmcontinue = "";
      for (let i = 0; i < 5; i++) {
        try {
          let url = `https://stealabrainrot.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${r}&cmlimit=500&format=json${cmcontinue}`;
          let res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (!res.ok) break;
          let data = await res.json();
          let members = data?.query?.categorymembers || [];

          members.forEach(m => {
            if (m.ns === 0) {
              let title = m.title.replace(/_/g, " ");
              rarityMap[title] = r.replace("_", " ");
            }
          });

          if (data?.continue?.cmcontinue) {
            cmcontinue = `&cmcontinue=${encodeURIComponent(data.continue.cmcontinue)}`;
          } else {
            break;
          }
        } catch (e) {
          break;
        }
      }
    }

    // Parse the wiki page for Brainrots to get them in exact order of income
    try {
      let parseUrl = `https://stealabrainrot.fandom.com/api.php?action=parse&page=Brainrots&prop=text&format=json`;
      let res = await fetch(parseUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (res.ok) {
        let data = await res.json();
        let htmlContent = data?.parse?.text?.["*"] || "";
        
        let matches = htmlContent.match(/<a[^>]+title="([^"]+)"[^>]*>([^<]+)<\/a>/g);
        if (matches) {
          let seen = new Set();
          matches.forEach(m => {
            let titleMatch = m.match(/title="([^"]+)"/);
            if (titleMatch && titleMatch[1]) {
              let title = titleMatch[1].replace(/_/g, " ");
              if (!title.includes("Category:") && !title.includes("File:") && !title.includes("Special:") && !title.includes("Template:") && !title.includes("Help:")) {
                if (!seen.has(title) && rarityMap[title]) {
                  seen.add(title);
                  brainrotEntries.push({
                    name: title,
                    rarity: rarityMap[title]
                  });
                }
              }
            }
          });
        }
      }
    } catch (e) {}

    // Fallback if parsing fails
    if (brainrotEntries.length === 0) {
      brainrotEntries = Object.keys(rarityMap).map(name => ({ name, rarity: rarityMap[name] }));
    }

    let markdown = `# BRAINROTS (in order of income) (${brainrotEntries.length} total entries)
${brainrotEntries.map((b, i) => `${i + 1}. **${b.name}** — *Rarity: ${b.rarity}*`).join('\n')}`;

    const encodedContent = btoa(unescape(encodeURIComponent(markdown)));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Brainrots in Order of Income</title>
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
  h1 {
    color: #58a6ff;
  }
  strong {
    color: #ffa657;
  }
  em {
    color: #8b949e;
  }
</style>
</head>
<body><div id="content">Loading brainrots in order of income...</div>
<script>
(function(){
  try {
    var encoded = "${encodedContent}";
    var markdown = decodeURIComponent(escape(atob(encoded)));
    document.getElementById('content').textContent = markdown;
  } catch(e) {
    document.getElementById('content').textContent = "Error loading list.";
  }
})();
</script>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=UTF-8" }
    });
  }
};
