const API = "https://stealabrainrot.fandom.com/api.php";

async function getAllWikiPages() {
  let pages = [];
  let apcontinue = "";

  while (true) {
    const url =
      `${API}?action=query&list=allpages&aplimit=max&format=json` +
      (apcontinue ? `&apcontinue=${encodeURIComponent(apcontinue)}` : "");

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    if (!res.ok) break;

    const json = await res.json();

    if (json.query?.allpages) {
      pages.push(...json.query.allpages);
    }

    if (!json.continue?.apcontinue) break;
    apcontinue = json.continue.apcontinue;
  }

  return pages;
}
