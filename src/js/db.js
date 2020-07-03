/* eslint-disable require-jsdoc */
import {openDB} from 'idb';
import {getMatchById} from './api';

const dbPromise = openDB('saved-matches', 1, {
  upgrade(db) {
    const matchesObjectStore = db.createObjectStore('matches', {
      keyPath: 'id',
    });
    matchesObjectStore.createIndex('homeTeam', 'homeTeam', {unique: false});
    matchesObjectStore.createIndex('awayTeam', 'awayTeam', {unique: false});
  },
});

async function saveMatch(matchId) {
  const match = await getMatchById(matchId);

  dbPromise.then(function(db) {
    const tx = db.transaction('matches', 'readwrite');
    const store = tx.objectStore('matches');
    store.add(match.match);
    return tx.done;
  }).then(function() {
    console.log('Success');
  }).catch(function() {
    console.log('Failed');
  });
}

async function getSavedMatches() {
  return await dbPromise.then(function(db) {
    const tx = db.transaction('matches', 'readonly');
    const store = tx.objectStore('matches');
    return store.getAll();
  });
}

async function deleteMatchById(id) {
  return await dbPromise.then(function(db) {
    const tx = db.transaction('matches', 'readwrite');
    const store = tx.objectStore('matches');
    return store.delete(id);
  });
}

export {saveMatch, getSavedMatches, deleteMatchById};

