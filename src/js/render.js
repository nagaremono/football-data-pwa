/* eslint-disable require-jsdoc */
import {saveMatch, deleteMatchById} from './db';

function initiateNav() {
  return new Promise(function(resolve, reject) {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    resolve(renderLinks());
  });
}

function renderLinks() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status !== 200) return;

      linkDropdownTriggers(xhttp.responseText);

      const elems = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(elems);

      document.querySelectorAll('sidenav a, .right a').forEach(function(elm) {
        elm.addEventListener('click', function(event) {
          const sidenav = document.querySelector('.sidenav');
          M.Sidenav.getInstance(sidenav).close();
        });
      });
    }
  };
  xhttp.open('GET', '/pages/links.html', true);
  xhttp.send();
}

function linkDropdownTriggers(responseText) {
  document.querySelectorAll('.right, .sidenav').forEach((nav, key) => {
    nav.innerHTML = responseText;

    /*
      .standing and .matches are dropdown triggers per materialize spec.
      .standingdropdown and .matchesdropdown are their respective content.
      The lines below associate triggers and their content with data-target
      and id of the same value.
      Index number(key) from forEach is used to differentiate
      top navigation and side navigation.
    */

    const standingLinks = nav.querySelector('.standing');
    standingLinks.setAttribute('data-target', `standing${key}`);

    const matchesLinks = nav.querySelector('.matches');
    matchesLinks.setAttribute('data-target', `matches${key}`);

    const standingDropDown = nav.querySelector('.standingdropdown');
    standingDropDown.id = `standing${key}`;

    const matchesDropDown = nav.querySelector('.matchesdropdown');
    matchesDropDown.id = `matches${key}`;
  });
}

function renderPage(page) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      const mainContent = document.querySelector('.main-content');
      if (this.status === 200) {
        mainContent.innerHTML = xhttp.responseText;
      } else {
        mainContent.innerHTML = '<p>Something went wrong</p>';
      }
    }
  };

  if (page === 'standings' || page === 'matches' || page === 'saved') {
    xhttp.open('GET', `/${page}.html`, true);
  } else {
    xhttp.open('GET', `/pages/${page}.html`, true);
  }
  xhttp.send();
}

function fillCompetitionsDropdown(competitionsJson) {
  const leagueStandings = document.querySelectorAll('.standingdropdown');
  const leagueMatches = document.querySelectorAll('.matchesdropdown');

  competitionsJson.competitions.forEach((competition) => {
    leagueStandings.forEach((leagueStanding) => {
      leagueStanding.innerHTML += `
        <li>
          <a href="/standings.html?id=${competition.id}">
            ${competition.name}
          </a>
        </li>
      `;
    });

    leagueMatches.forEach((leagueMatch) => {
      leagueMatch.innerHTML += `
        <li>
          <a href="/matches.html?id=${competition.id}">
            ${competition.name}
          </a>
        </li>
      `;
    });
  });
}

function renderStandings(standingsObj) {
  const mainContent = document.querySelector('.main-content');

  mainContent.innerHTML += `
    <div class="competition-detail">
      <h2>
        ${standingsObj.competition.name}        
      </h2>
      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Region</td>
            <td>${standingsObj.competition.area.name}</td>
          </tr>
          <tr>
            <td>Season Start</td>
            <td>${standingsObj.season.startDate}</td>
          </tr>
          <tr>
            <td>Season End</td>
            <td>${standingsObj.season.endDate}</td>
          </tr>
        </tbody>
      <table>
    </div>
  `;

  mainContent.innerHTML += `
    <div class="row"></div>
  `;

  standingsObj.standings[0].table.forEach((tab) => {
    const imgUrl = tab.team.crestUrl ? tab.team.crestUrl.replace(/^http:\/\//i, 'https://') : '/images/mega-ball.png';

    mainContent.querySelector('.row').innerHTML += `
      <div class="col s12 m6 l4">
        <div class="card large indigo darken-3">
          <div class="card-content white-text">
            <span class="card-title">${tab.team.name}
              <img class="right" 
              src="${imgUrl}
              ">
            </span>
            <table>
              <tr>
                <th>Position</th>
                <td>${tab.position}</td>                  
              </tr>
              <tr>
                <th>Team Name</th>
                <td>${tab.team.name}</td>
              </tr>
              <tr>
                <th>Played Games</th>
                <td>${tab.playedGames}</td>
              </tr>
              <tr>
                <th>Games Won</th>
                <td>${tab.won}</td>
              </tr>
              <tr>
                <th>Games Lost</th>
                <td>${tab.lost}</td>
              </tr>
              <tr>
                <th>Games Draw</th>
                <td>${tab.draw}</td>
              </tr>
              <tr>
                <th>Points</th>
                <td>${tab.points}</td>
              </tr>                  
            </table>
          </div>
        </div>
      </div>
    `;
  });

  hidePreloader();
}

function renderMatches(matchesObj) {
  const mainContent = document.querySelector('.main-content');

  mainContent.innerHTML += `
    <div class="competition-detail">
      <h2>
        ${matchesObj.competition.name}        
      </h2>
      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Region</td>
            <td>${matchesObj.competition.area.name}</td>
          </tr>
          <tr>
            <td>Last Updated</td>
            <td>${matchesObj.competition.lastUpdated}</td>
          </tr>
        </tbody>
      <table>
    </div>
  `;

  mainContent.innerHTML += `
    <div class="row"></div>
  `;

  matchesObj.matches.forEach((match) => {
    mainContent.querySelector('.row').innerHTML += `
      <div class="col s12 m6 l4">
        <div class="card large indigo darken-3">
          <div class="card-content white-text">
            <span class="card-title">${match.id}</span>
            <a 
              onclick="M.toast({html: 'Saved!'})" 
              class="btn savebutton lime" 
              data-match-id="${match.id}"
            >
              Save
            </a>
            <table>
              <tr>
                <th>Date</th>
                <td>${match.utcDate}</td>                  
              </tr>
              <tr>
                <th>Home Team</th>
                <td>${match.homeTeam.name}</td>
              </tr>
              <tr>
                <th>Away Team</th>
                <td>${match.awayTeam.name}</td>
              </tr>
              <tr>
                <th>Home Team Score</th>
                <td>${match.score.fullTime.homeTeam}</td>
              </tr>
              <tr>
                <th>Away Team Score</th>
                <td>${match.score.fullTime.awayTeam}</</td>
              </tr>
              <tr>
                <th>Winner</th>
                <td>${match.score.winner}</td>
              </tr>             
            </table>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll('.savebutton').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.target.className += ' disabled';
      const matchId = event.target.dataset.matchId;

      saveMatch(matchId);
    });
  });

  hidePreloader();
}

function renderSavedMatches(matches) {
  const mainContent = document.querySelector('.main-content');

  if (!matches) {
    mainContent.innerHTML += `
      <h3>Looks like you haven't saved any matches yet.</h3>
    `;
  }
  mainContent.innerHTML += `
    <div class="row"></div>
  `;

  matches.forEach((match) => {
    mainContent.querySelector('.row').innerHTML += `
      <div class="col s12 m6 l4">
        <div class="card large indigo darken-3">
          <div class="card-content white-text">
            <span class="card-title">${match.id}</span>
            <a 
              onclick="M.toast({html: 'Deleted!'})" 
              class="btn deletebutton lime" 
              data-match-id="${match.id}"
            >
              Delete
            </a>
            <table>
              <tr>
                <th>Date</th>
                <td>${match.utcDate}</td>                  
              </tr>
              <tr>
                <th>Home Team</th>
                <td>${match.homeTeam.name}</td>
              </tr>
              <tr>
                <th>Away Team</th>
                <td>${match.awayTeam.name}</td>
              </tr>
              <tr>
                <th>Home Team Score</th>
                <td>${match.score.fullTime.homeTeam}</td>
              </tr>
              <tr>
                <th>Away Team Score</th>
                <td>${match.score.fullTime.awayTeam}</</td>
              </tr>
              <tr>
                <th>Winner</th>
                <td>${match.score.winner}</td>
              </tr>             
            </table>
          </div>
        </div>
      </div>
    `;
  });


  document.querySelectorAll('.deletebutton').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.target.className += ' disabled';
      const matchId = event.target.dataset.matchId;

      deleteMatchById(parseInt(matchId)).then(function() {
        window.location = '/saved.html';
      });
    });
  });

  hidePreloader();
}

function hidePreloader() {
  document.querySelector('.progress').style.display = 'none';
}

export {
  initiateNav,
  renderPage,
  fillCompetitionsDropdown,
  renderStandings,
  renderMatches,
  renderSavedMatches,
  hidePreloader,
};
