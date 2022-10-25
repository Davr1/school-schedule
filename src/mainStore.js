import { writable } from "svelte/store";

export const fetchCount = writable(0);
export const fetchQueue = writable();

export const isSubjectInfoVisible = writable(false);
export const isModalVisible = writable(false);
