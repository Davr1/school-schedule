import { writable } from "svelte/store";

export const fetchCount = writable(0);
export const fetchQueue = writable<Symbol>();
export const cache = writable(false);
