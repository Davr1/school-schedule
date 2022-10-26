export const scheduleMetadata = {
    classes: [
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
    ],
    teachers: [{ abbr: null, name: null }],
    rooms: [{ abbr: null, name: null }]
};
export const modes = [
    { name: "Permanent", id: "Permanent" },
    { name: "Current", id: "Actual" },
    { name: "Next", id: "Next" },
    { name: "Other", id: "Other" }
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