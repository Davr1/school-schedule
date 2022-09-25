import { writable } from "svelte/store";

export const classList = [
    { name: "P1.A", id: "UG" },
    { name: "P1.B", id: "UI" },
    { name: "T1.C", id: "UJ" },
    { name: "P2.A", id: "UD" },
    { name: "P2.B", id: "UE" },
    { name: "T2.C", id: "UF" },
    { name: "P3.A", id: "UA" },
    { name: "P3.B", id: "UB" },
    { name: "T3.C", id: "UC" },
    { name: "G4.A", id: "U7" },
    { name: "P4.B", id: "U8" },
    { name: "T4.C", id: "U9" }
];

export let fetchCount = writable(0);

export let scheduleParams = writable({ class: classList.find((e) => e.name === "P2.B"), mode: "Actual" });
