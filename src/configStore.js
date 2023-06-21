import { browser } from "$app/environment";
import { get, writable } from "svelte/store";
import { modes, scheduleMetadata } from "./staticStore";
import { readURL } from "./utilities";

Array.prototype["search"] = function (key, value, fallback) {
    return this.find((o) => o[key] === value) ?? this.find((o) => o[key] === fallback);
};

// Configuration
let localConfig;

try {
    localConfig = JSON.parse(localStorage.getItem("config"));
    if (!localConfig.keepState) {
        localConfig.scheduleParams = readURL(window.location);
    }
} catch {
    localConfig = {};
}

export const defaultLSConfig = {
    updateURL: true,
    keepState: false,
    useWeb: true,
    sundayOverride: true,
    loadscreen: true,
    cache: true,
    scheduleParams: {
        class: "P2.B",
        mode: "Current",
        type: undefined,
        value: undefined
    }
};

export const defaultConfig = configFormatter(defaultLSConfig);
export const config = writable(configFormatter(localConfig, defaultConfig));
export const scheduleParams = writable(get(config).scheduleParams);

config.subscribe((value) => {
    value.scheduleParams = get(scheduleParams);

    if (browser) {
        localStorage.setItem("config", JSON.stringify(configDeformatter(value)));
    }
});

export function configFormatter(config, fallback = {}) {
    let _fallback = structuredClone(fallback);
    let output = Object.assign(_fallback, config);
    output.scheduleParams = paramsFormatter(output.scheduleParams ?? {});
    return output;
}

export function configDeformatter(config) {
    let output = structuredClone(config);
    output.scheduleParams.mode = config.scheduleParams.mode.name;
    output.scheduleParams.class = config.scheduleParams.class.name;
    return output;
}

// Schedule params

export function updateScheduleParams(newParams = {}) {
    let oldParams = get(scheduleParams);
    newParams = paramsFormatter({
        class: oldParams?.class?.name,
        mode: oldParams?.mode?.name,
        type: oldParams?.type,
        value: oldParams?.value,
        ...newParams
    });
    scheduleParams.set(newParams);
    config.update((a) => a);
}

export function paramsFormatter(params) {
    let output = structuredClone(params);
    output.mode = modes.search("name", params.mode, defaultLSConfig.scheduleParams.mode);
    output.class = scheduleMetadata.classes.search("name", params.class, defaultLSConfig.scheduleParams.class);
    return output;
}
