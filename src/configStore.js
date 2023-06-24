import { browser } from "$app/environment";
import { get, writable } from "svelte/store";
import { PUBLIC_VERSION } from "$env/static/public";

Array.prototype["search"] = function (key, value, fallback) {
    return this.find((o) => o[key] === value) ?? this.find((o) => o[key] === fallback);
};

// Configuration
let localConfig;

try {
    localConfig = JSON.parse(localStorage.getItem("config"));
    if (localConfig.version !== PUBLIC_VERSION) localConfig = {};
    /*if (!localConfig.keepState) {
        localConfig.scheduleParams = readURL(window.location);
    }*/
} catch {
    localConfig = {};
}

export const defaultConfig = {
    updateURL: true,
    keepState: false,
    useWeb: true,
    sundayOverride: true,
    loadscreen: true,
    cache: true,
    scheduleParams: {
        scheduleMode: "Class",
        weekMode: "Current",
        value: "P2.B"
    },
    version: PUBLIC_VERSION
};

const defaultValues = {
    Class: "P2.B",
    Teacher: "Mašek Petr",
    Room: "104"
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
    if (newParams.scheduleMode && newParams.scheduleMode !== oldParams.scheduleMode) {
        newParams.value = defaultValues[newParams.scheduleMode];
    }
    newParams = { ...oldParams, ...newParams };
    scheduleParams.set(newParams);
    config.update((a) => a);
}
