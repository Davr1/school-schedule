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

export const hours = {
    offsets: [
        [475, 5],
        [45, 10],
        [45, 20],
        [45, 10],
        [45, 10],
        [45, 10],
        [45, 10],
        [45, 10],
        [45, 10],
        [45, 10],
        [45, 10],
        [45, 10],
        [45, 10]
    ],
    get time() {
        let output = [];
        let time = 0;
        this.offsets.forEach(([cls, brk]) => {
            let a = Math.floor(time / 60) + ":" + ("0" + (time % 60)).slice(-2);
            time += cls;
            let b = Math.floor(time / 60) + ":" + ("0" + (time % 60)).slice(-2);
            time += brk;
            output.push([a, b]);
        });
        output.shift();
        return output;
    }
};

export let fetchCount = writable(0);

let params = new URL(document.location).searchParams;
export let scheduleParams = writable({
    class: classList.find((e) => e.name === (params.get("cls") ?? "P2.B")),
    mode: params.has("Next") ? "Next" : params.has("Permanent") ? "Permanent" : "Actual"
});