import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const date = writable(new Date());

 
export default date;