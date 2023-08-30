import { get, writable } from "svelte/store";

import { browser, version } from "$app/environment";

import { scheduleMetadata } from "$stores/static";

export type ScheduleMode = "Class" | "Teacher" | "Room";
export type WeekMode = "Permanent" | "Current" | "Next";
export type Value =
    | (typeof scheduleMetadata.classes)[number]["name"]
    | (typeof scheduleMetadata.teachers)[number]["name"]
    | (typeof scheduleMetadata.teachers)[number]["abbr"]
    | (typeof scheduleMetadata.rooms)[number]["name"];

export interface ScheduleParams {
    scheduleMode: ScheduleMode;
    weekMode: WeekMode;
    value: Value;
}

export interface Config {
    useWeb: boolean;
    sundayOverride: boolean;
    loadscreen: boolean;
    cache: boolean;
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
    useWeb: false,
    sundayOverride: true,
    loadscreen: true,
    cache: true,
    scheduleParams: {
        scheduleMode: "Class",
        weekMode: "Current",
        value: "P2.B"
    },

    version
};

const defaultValues: Record<ScheduleMode, Value> = {
    Class: "P2.B",
    Teacher: "Mašek Petr",
    Room: "104"
};

const possibleValues = {
    Class: scheduleMetadata.classes.map((c) => c.name),
    Teacher: scheduleMetadata.teachers.map((t) => t.name),
    Room: scheduleMetadata.rooms.map((r) => r.name)
};

export const config = writable({ ...defaultConfig, ...localConfig });
export const scheduleParams = writable(get(config).scheduleParams);

config.subscribe((value) => {
    value.scheduleParams = get(scheduleParams);

    if (browser) {
        localStorage.setItem("config", JSON.stringify(value));
    }
});

/**
 * Updates the schedule params with the new values
 * @param newParams New schedule params. If a value is ommited, it won't be changed
 */
export function updateScheduleParams(newParams: Partial<ScheduleParams> = {}) {
    // Retrieve the old params because we don't want to overwrite them
    let oldParams = get(scheduleParams);

    // Combine the old and new params
    let params: ScheduleParams = { ...oldParams, ...newParams };

    // replace abbreviation with full name
    if (newParams.scheduleMode === "Teacher") {
        // For future @iCyuba reading this. look at this message: https://discord.com/channels/@me/1115648324821843999/1122616953769566319
        let teacher = scheduleMetadata.teachers.find((t) => t.abbr === newParams.value);

        if (teacher) params.value = teacher.name;
    }

    // If the new value is not in the possible values, set it to the default one
    // The constant values doesn't really work here so I'm asserting it as a string array
    const possibleValuesForMode = possibleValues[params.scheduleMode] as string[];
    if (!possibleValuesForMode.includes(params.value)) {
        params.value = defaultValues[params.scheduleMode];
    }

    console.log(params);
    scheduleParams.set(params);
    // TODO: Change this cuz wtf
    // Correct me if I'm wrong, but you're doing this because you want to call the
    // subscriber on line 72 (and 73) and rewrite the config with the new schedule params..
    // Why not just keep them separate? @Davr1
    config.update((a) => a);
}
