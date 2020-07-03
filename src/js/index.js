import 'regenerator-runtime';
import './registersw';
import './notification';
import '../css/style.css';
import {
  getCompetitions, getStandingsByCompetition, getMatchesByCompetition,
} from './api';
import {
  initiateNav,
  renderPage,
  fillCompetitionsDropdown,
  renderStandings,
  renderMatches,
  renderSavedMatches,
  hidePreloader,
} from './render';
import {getSavedMatches} from './db';

document.addEventListener('DOMContentLoaded', async function() {
  await initiateNav();

  await getCompetitions().then(fillCompetitionsDropdown);

  if (window.location.href.indexOf('standings.html') !== -1) {
    renderPage('standings');
    getStandingsByCompetition().then(renderStandings);
  } else if (window.location.href.indexOf('matches.html') !== -1) {
    renderPage('matches');
    getMatchesByCompetition().then(renderMatches);
  } else if (window.location.href.indexOf('saved.html') !== -1) {
    getSavedMatches().then(renderSavedMatches);
  } else {
    renderPage('home');
    hidePreloader();
  }
});
