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
    get formattedTime() {
        let output = [];
        let time = 0;
        this.offsets.forEach(([cls, brk]) => {
            let a = Math.floor(time / 60) + ":" + `0${time % 60}`.slice(-2);
            time += cls;
            let b = Math.floor(time / 60) + ":" + `0${time % 60}`.slice(-2);
            time += brk;
            output.push([a, b]);
        });
        output.shift();
        return output;
    }
};

export const urls = {
    proxy: "https://api.allorigins.win/get?charset=windows-1250&url=",
    schoolWebsite: "https://www.sssvt.cz",
    baka: "https://is.sssvt.cz/IS"
};

class Subject {
    constructor(args) {
        Object.assign(this, args);
    }
    type = -1;
    id = Symbol();
}

class EmptySubject extends Subject {
    constructor(args) {
        super({
            changed: false,
            changeInfo: "",
            ...args
        });
    }
    type = 0;
}

class StandardSubject extends Subject {
    constructor(args) {
        super({
            cls: "",
            subject: "",
            subjectAbbr: "",
            teacher: "",
            teacherAbbr: "",
            room: "",
            group: "",
            theme: "",
            changed: false,
            changeInfo: "",
            ...args
        });
    }
    type = 1;
}

class SpecialSubject extends Subject {
    constructor(args) {
        super({
            special: "",
            specialAbbr: "",
            changeInfo: "",
            ...args
        });
    }
    type = 2;
}

export const templates = {
    EmptySubject,
    StandardSubject,
    SpecialSubject
};
