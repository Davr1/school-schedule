import { get, writable, type Writable } from "svelte/store";

import { browser, version } from "$app/environment";

import { scheduleMetadata } from "$stores/static";

export type ScheduleMode = "Class" | "Teacher" | "Room";
export type WeekMode = "Permanent" | "Current" | "Next";

export type ClassValue = (typeof scheduleMetadata.classes)[number]["name"];
export type TeacherValue = (typeof scheduleMetadata.teachers)[number]["name"] | (typeof scheduleMetadata.teachers)[number]["abbr"];
export type RoomValue = (typeof scheduleMetadata.rooms)[number]["name"];
export type Value = ClassValue | TeacherValue | RoomValue;

export interface ScheduleParams {
    scheduleMode: ScheduleMode;
    weekMode: WeekMode;
    value: Value;
}

export type UncheckedParams = { [K in keyof ScheduleParams]?: string };

export interface Config {
    useWeb: boolean;
    saturdayOverride: boolean;
    loadscreen: boolean;
    mergeSubjects: boolean;
    version: string;

    scheduleParams: ScheduleParams;
}

// Configuration
let localConfig: Partial<Config>;
try {
    localConfig = JSON.parse(localStorage.getItem("config") ?? "{}");

    if (localConfig.version !== version) localConfig = {};
} catch {
    localConfig = {};
}

export const defaultConfig: Config = {
    useWeb: true,
    saturdayOverride: true,
    loadscreen: true,
    mergeSubjects: true,
    scheduleParams: {
        scheduleMode: "Class",
        weekMode: "Current",
        value: "P4.B"
    },

    version
};

const defaultValues: Record<ScheduleMode, Value> = {
    Class: "P4.B",
    Teacher: "Mašek Petr",
    Room: "104"
};

export const possibleValues = {
    Class: scheduleMetadata.classes.map((c) => c.name),
    Teacher: scheduleMetadata.teachers.map((t) => t.name),
    Room: scheduleMetadata.rooms.map((r) => r.name)
};

export const config = writable({ ...defaultConfig, ...localConfig });
export const scheduleParams = createScheduleParamsStore(get(config).scheduleParams);

config.subscribe((value) => {
    value.scheduleParams = get(scheduleParams);

    if (browser) {
        localStorage.setItem("config", JSON.stringify(value));
    }
});

/**
 * Create a new schedule params store
 */
function createScheduleParamsStore(baseParams: ScheduleParams): Writable<ScheduleParams> {
    const { subscribe, set, update } = writable(baseParams);

    function normalizeParams(params: ScheduleParams) {
        // replace abbreviation with full name
        if (params.scheduleMode === "Teacher") {
            // For future @iCyuba reading this. look at this message: https://discord.com/channels/@me/1115648324821843999/1122616953769566319
            let teacher = scheduleMetadata.teachers.find((t) => t.abbr === params.value);

            if (teacher) params.value = teacher.name;
        }

        // If the new value is not in the possible values, set it to the default one
        // The constant values doesn't really work here so I'm asserting it as a string array
        const possibleValuesForMode = possibleValues[params.scheduleMode] as string[];
        if (!possibleValuesForMode.includes(params.value)) {
            params.value = defaultValues[params.scheduleMode];
        }
    }

    return {
        subscribe,

        set(params) {
            normalizeParams(params);

            // Run the config's subscribers
            config.update((a) => a);

            return set(params);
        },

        update(updater) {
            return update((params) => {
                const newParams = updater(params);
                normalizeParams(newParams);

                // Run the config's subscribers
                config.update((a) => a);

                return newParams;
            });
        }
    };
}
