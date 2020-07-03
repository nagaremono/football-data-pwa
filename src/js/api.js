/* eslint-disable require-jsdoc */
const baseUrl = 'https://api.football-data.org/v2/competitions';

async function getCompetitions() {
  const url = `${baseUrl}/?plan=TIER_ONE`;

  if ('caches' in window) {
    const competition = await caches.match(url);
    if (competition) return competition.json();
  }

  const competitions = await callAPI(url);
  return competitions.json();
}

async function getStandingsByCompetition() {
  const urlParams = new URLSearchParams(window.location.search);
  const competitionId = urlParams.get('id');
  const url = `${baseUrl}/${competitionId}/standings`;

  if ('caches' in window) {
    const standing =
      await caches.match(url);
    if (standing) return standing.json();
  }

  const standings = await callAPI(url);

  return standings.json();
}

async function getMatchesByCompetition() {
  const urlParams = new URLSearchParams(window.location.search);
  const competitionId = urlParams.get('id');
  const url = `${baseUrl}/${competitionId}/matches?status=FINISHED`;

  if ('caches' in window) {
    const matches =
      await caches.match(url);
    if (matches) return matches.json();
  }

  const matches = await callAPI(url);

  return matches.json();
}

async function getMatchById(id) {
  const url = `https://api.football-data.org/v2/matches/${id}`;

  if ('cache' in window) {
    const match = await caches.match(url);
    if (match) return match.json();
  }

  const match = await callAPI(url);

  return match.json();
}

function callAPI(url) {
  return fetch(url, {
    mode: 'cors',
    headers: {
      'X-Auth-Token': '24319b78f2b5495e99a19c04cdc5c6d0',
    },
  });
}

export {
  getCompetitions,
  getStandingsByCompetition,
  getMatchesByCompetition,
  getMatchById,
};
