import type { ScheduleMode, ScheduleParams, WeekMode } from "$stores/config";

/** All the classes, teachers and rooms in the school... */
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
    teachers: [
        { name: "Antoš Petr", id: "U0030", abbr: "An" },
        { name: "Bláhová Ludmila", id: "UKYOM", abbr: "Bh" },
        { name: "Dvořáková Lenka", id: "UWYPV", abbr: "Dv" },
        { name: "Fiala Libor", id: "U30J8", abbr: "Fi" },
        { name: "Filip Petr", id: "UZYNS", abbr: "Fp" },
        { name: "Foltýn Pavel", id: "UUYPK", abbr: "Fo" },
        { name: "Fučíková Jana", id: "URYP4", abbr: "Fu" },
        { name: "Hromádko Přemysl", id: "UKYOL", abbr: "Hm" },
        { name: "Ivon Pavel", id: "ULYOS", abbr: "Iv" },
        { name: "Jurčeková Martina", id: "UTYP8", abbr: "Ju" },
        { name: "Jurčík Martin", id: "UVYPO", abbr: "Jí" },
        { name: "Klein Ivan", id: "U0011", abbr: "Kn" },
        { name: "Kleinová Radka", id: "U0025", abbr: "Ká" },
        { name: "Korovin Vsevolod", id: "UQYOY", abbr: "Kv" },
        { name: "Kratochvíl Aleš", id: "U0037", abbr: "Kt" },
        { name: "Mašát Marek", id: "UUYPL", abbr: "Mš" },
        { name: "Mašek Petr", id: "UZYNH", abbr: "Ma" },
        { name: "Megvinet Ivana", id: "UYGLD", abbr: "Me" },
        { name: "Pelikánová Zdeňka", id: "UQYP2", abbr: "Pe" },
        { name: "Pícha Miloš", id: "UUYPM", abbr: "Pí" },
        { name: "Pivoňka Jakub", id: "URYP3", abbr: "Pv" },
        { name: "Šafránková Hana", id: "UZ2TE", abbr: "Ša" },
        { name: "Šibrava Ondřej", id: "ULYOP", abbr: "Šb" },
        { name: "Strnka Richard", id: "URYP5", abbr: "St" },
        { name: "Týfová Ilse", id: "UKYOK", abbr: "Tý" },
        { name: "Vaněček Ondřej", id: "UVYPP", abbr: "Va" },
        { name: "Vodička Martin", id: "U0001", abbr: "Vo" },
        { name: "Vostárek Tomáš", id: "UZYNE", abbr: "Vs" },
        { name: "Westfál David", id: "UWYPU", abbr: "We" },
        { name: "Zikán Jiří", id: "UTYPB", abbr: "Zk" }
    ],
    rooms: [
        { name: "01", id: "U2" },
        { name: "02", id: "GZ" },
        { name: "03", id: "A5" },
        { name: "06", id: "IZ" },
        { name: "102", id: "6B" },
        { name: "103", id: "35" },
        { name: "104", id: "OG" },
        { name: "107", id: "VF" },
        { name: "108", id: "LG" },
        { name: "109", id: "FO" },
        { name: "114", id: "00" },
        { name: "115", id: "30" },
        { name: "116", id: "ZZ" },
        { name: "202", id: "9A" },
        { name: "203", id: "84" },
        { name: "204", id: "51" },
        { name: "208", id: "C0" },
        { name: "209", id: "N5" },
        { name: "210", id: "DT" },
        { name: "211", id: "32" },
        { name: "213", id: "ZX" },
        { name: "214", id: "G0" },
        { name: "TĚL", id: "T0" }
    ]
} as const;

/** A value that can be used in the Bakalari API */
export type BakalariValue =
    | (typeof scheduleMetadata.classes)[number]["id"]
    | (typeof scheduleMetadata.teachers)[number]["id"]
    | (typeof scheduleMetadata.rooms)[number]["id"];

/** Parameters used by Bakalari */
export interface BakalariParams {
    scheduleMode: ScheduleMode;
    weekMode: Omit<WeekMode, "Current"> | "Actual"; // "Actual" is the what Bakalari calls "Current"
    value: BakalariValue;
}

/**
 * Remap the parameters to the format used by Bakalari
 * @param params The parameters to remap (from the config)
 * @returns Remapped Bakalari parameters
 */
export function toBakaParams(params: ScheduleParams): BakalariParams {
    // This declaration is weird. ik..
    const { scheduleMode } = params;

    // If the week mode is "Current", we want to use "Actual" instead
    const weekMode = params.weekMode === "Current" ? "Actual" : params.weekMode;

    let value: BakalariValue;
    switch (scheduleMode) {
        case "Teacher":
            // @ts-ignore // TODO: obv remove this in the future
            // Yes, this is weird and needs to be rewritten
            // NOTE: For any future @iCyuba see the comment in config.ts:94
            value = scheduleMetadata.teachers.find((t) => t.name === params.value || t.abbr === params.value)!.id;
            break;
        case "Room":
            value = scheduleMetadata.rooms.find((r) => r.name === params.value)!.id;
            break;
        case "Class":
        default:
            value = scheduleMetadata.classes.find((c) => c.name === params.value)!.id;
    }

    return { weekMode, scheduleMode, value };
}

// TODO: Remove and use enums instead
export const weekModes = ["Permanent", "Current", "Next"] as const;
export const sheduleModes = ["Class", "Teacher", "Room"] as const;

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
        let output: [string, string][] = [];
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
} as const;

/** Endpoints for fetching data */
export const urls = {
    substitution: "/sssvt/substitution",
    schedule: "/sssvt/schedule",
    baka: "https://is.sssvt.cz/IS"
} as const;

export class Subject {
    constructor(args) {
        Object.assign(this, args);
    }
    type = -1;
    id = Symbol();
}

export class EmptySubject extends Subject {
    constructor(args) {
        super({
            changed: false,
            changeInfo: "",
            ...args
        });
    }
    type = 0;
}

export class StandardSubject extends Subject {
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

export class SpecialSubject extends Subject {
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
