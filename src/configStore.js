import { browser, version } from "$app/environment";
import { get, writable } from "svelte/store";
import { scheduleMetadata } from "./staticStore";

Array.prototype["search"] = function (key, value, fallback) {
    return this.find((o) => o[key] === value) ?? this.find((o) => o[key] === fallback);
};

// Configuration
let localConfig;

try {
    localConfig = JSON.parse(localStorage.getItem("config"));
    if (localConfig.version !== version) localConfig = {};
    /*if (!localConfig.keepState) {
        localConfig.scheduleParams = readURL(window.location);
    }*/
} catch {
    localConfig = {};
}

export const defaultConfig = {
    useWeb: true,
    sundayOverride: true,
    loadscreen: true,
    cache: true,
    scheduleParams: {
        scheduleMode: "Class",
        weekMode: "Current",
        value: "P2.B"
    },
    version: version
};

const defaultValues = {
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

// Schedule params

export function updateScheduleParams(newParams = {}) {
    let oldParams = get(scheduleParams);
    if (newParams.scheduleMode && newParams.scheduleMode !== oldParams.scheduleMode && !newParams.value) {
        newParams.value = defaultValues[newParams.scheduleMode];
    }

    newParams = { ...oldParams, ...newParams };

    if (newParams.scheduleMode === "Teacher") {
        // replace abbreviation with full name
        let teacher = scheduleMetadata.teachers.find((t) => t.abbr === newParams.value || t.name === newParams.value);
        newParams.value = teacher.name;
    }

    if (possibleValues[newParams.scheduleMode].indexOf(newParams.value) === -1) {
        newParams.value = defaultValues[newParams.scheduleMode];
    }

    console.log(newParams);
    scheduleParams.set(newParams);
    config.update((a) => a);
}
