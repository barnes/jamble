import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const results = writable({
    gamesPlayed: 0,
    numberCorrect: [],
    numberComplete: 0,
    timePlayed: 0,
});
 
results.subscribe((value) => {
  if (browser) {
        Object.keys(value).forEach((key) => {
            window.localStorage.setItem(`scram-${key}`, `${value[key]}`);
        })
  }
});
 
export default results;