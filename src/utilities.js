import { scheduleParams } from "./configStore";
import { config } from "./configStore";
import { get } from "svelte/store";
import { encode } from "windows-1250";

function createElement(el) {
    if (!el) return null;
    if (typeof el === "string") {
        try {
            el = new DOMParser().parseFromString(el, "text/html");
        } catch {
            console.error(el);
            return;
        }
    }
    return new Proxy(el, elementProxy);
}

function functionProxy(original, modify) {
    return new Proxy(original, {
        apply: function (target, thisArg, argList) {
            return modify(Reflect.apply(target, thisArg, argList));
        }
    });
}

const elementProxy = {
    get: function (target, property) {
        let temp, proxied;
        switch (property) {
            case "$":
            case "querySelector":
                proxied = functionProxy(target.querySelector, (a) => createElement(a));
                break;
            case "$$":
            case "querySelectorAll":
                proxied = functionProxy(target.querySelectorAll, (a) => Array.from(a).map((e) => createElement(e)));
                break;
            case "next":
                temp = target.nextSibling;
                break;
            case "nextEl":
                temp = target.nextElementSibling;
                break;
            case "text":
            case "textContent":
                temp = target.textContent.trim();
                break;
            default:
                temp = target[property];
        }
        if (proxied) {
            temp = Function.prototype.bind.call(proxied, target);
        }
        if (temp instanceof HTMLCollection || temp instanceof NodeList) {
            temp = Array.from(temp).map((e) => createElement(e));
        }
        if (temp instanceof Node) {
            temp = createElement(temp);
        }
        return temp;
    }
};

// Public Bakalari schedule
export function fetchBaka(data) {
    return fetch(`https://is.sssvt.cz/IS/Timetable/Public/${data.mode.id}/Class/${data.class.id}`).then((response) => {
        if (response.ok) return response.text();
    });
}

// Substitution schedule from sssvt.cz
export function fetchWebSchedule(date) {
    return fetch(
        "https://api.allorigins.win/get?charset=windows-1250&url=" +
            encodeURIComponent("https://www.sssvt.cz/main.php?p=IS&pp=suplak&datum=" + date)
    ).then((response) => {
        if (response.ok) return response.json();
    });
}

// Teacher/room schedule
export function fetchWebScheduleAlt(mode, value, sub = true) {
    let encodedValue = Array.from(encode(value))
        .map((v) => "%25" + v.toString(16))
        .join("");
    return fetch(
        "https://api.allorigins.win/get?charset=windows-1250&url=" +
            encodeURIComponent("https://www.sssvt.cz/IS/rozvrh-hodin/" + mode + "/" + encodedValue + "/" + (sub ? "suplovaci" : ""))
    ).then((response) => {
        if (response.ok) {
            return response.json();
        }
    });
}

// Empty schedule, only used for getting teacher and room ids
export function fetchWebScheduleMetadata() {
    return fetch(
        "https://api.allorigins.win/get?charset=windows-1250&url=" + encodeURIComponent("https://www.sssvt.cz/IS/rozvrh-hodin/class/")
    ).then((response) => {
        if (response.ok) {
            return response.json();
        }
    });
}

export async function parseBakaSchedule(response) {
    let temp = createElement(await response);

    let schedule = [];

    temp.$$(".bk-timetable-row").forEach((row) => {
        let date = [row.$(".bk-day-day").text, row.$(".bk-day-date").text];
        let subjects = [];

        row.$$(".bk-timetable-cell").forEach((cell) => {
            let subject = [];

            cell.$$(".day-item-hover").forEach((group) => {
                subject.push({
                    ...JSON.parse(group.dataset.detail),
                    id: Symbol(),
                    subjectAbbr: group.$(".middle")?.text,
                    teacherAbbr: group.$(".bottom>span")?.text ?? "",
                    changed: Boolean(group.classList.contains("pink"))
                });
            });

            if (cell.children.length === 0) {
                subject.push({});
            }

            if (cell.$(".empty")) {
                subject.push({
                    special: cell.$("span")?.text,
                    id: Symbol()
                });
            }

            subjects.push(subject);
        });

        schedule.push({ subjects, date });
    });

    return schedule;
}

export async function parseWebSchedule(response) {
    let temp = createElement((await response).contents);

    let daySchedule = [];

    temp.$$(".table-responsive tbody tr:not(.prvniradek):nth-child(2n)").forEach((row) => {
        let cls = row.firstChild.text;
        let subjects = [];

        let firstHalf = row.$$("td:not(:first-of-type, .heightfix)");
        let secondHalf = row.nextEl.$$("td:not(.heightfix)");

        firstHalf.forEach((cell) => {
            if (cell.childNodes[0].text.replace(/\s+/, "")) {
                let subject = [];
                let group = "";

                if (cell.$("strong")?.next?.nodeName === "#text") {
                    group = cell.$("strong").next.text.match(/\d+\.sk/)[0];
                } else if (cell.firstChild.nodeName === "#text" && /\d+\.sk/.test(cell.firstChild.text)) {
                    group = cell.firstChild.text.match(/\d+\.sk/)[0];
                }

                subject.push({
                    room: cell.$("[href*='/room/']")?.text,
                    group,
                    id: Symbol(),
                    subjectAbbr: cell.$("strong")?.text,
                    teacherAbbr: cell.$("[href*='/teacher/']")?.text,
                    changed: true
                });

                if (cell.rowSpan === 1) {
                    let alternativeGroup = secondHalf.shift();
                    let group2 = "";

                    if (alternativeGroup.$("strong")?.next?.nodeName === "#text") {
                        group2 = alternativeGroup.$("strong").next.text.match(/\d+\.sk/)[0];
                    }

                    subject.push({
                        room: alternativeGroup.$("[href*='/room/']")?.text,
                        group: group2,
                        id: Symbol(),
                        subjectAbbr: alternativeGroup.$("strong")?.text,
                        teacherAbbr: alternativeGroup.$("[href*='/teacher/']")?.text,
                        changed: true
                    });
                }

                subjects.push(subject);
            } else {
                subjects.push([]);
            }
        });

        daySchedule.push({ cls, subjects });
    });

    return daySchedule;
}

export async function parseWebScheduleAlt(response) {
    let temp = createElement((await response).contents);

    let daySchedule = [];

    temp.$$(".day").forEach((row) => {
        let day = row.$(".dayTitle").text.match(/\S+/)[0];
        let subjects = [];

        row.$$(".hour:not(.dayTitle)").forEach((cell) => {
            if (!cell.classList.contains("group0")) {
                let subject = [];

                cell.$$("div.group").forEach((group) => {
                    let teacherAbbr;

                    if (get(scheduleParams).type === "teacher") {
                        teacherAbbr = get(scheduleParams).value;
                    } else if (get(scheduleParams).type === "room") {
                        teacherAbbr = group.$(".teacher a")?.text.match(/\S+/)[0];
                    }

                    let teacher = temp.$$(".links a").find((a) => a.text.trim() === teacherAbbr)?.title;

                    subject.push({
                        cls: group.$("[href*='/class/']")?.text.match(/\S+/)[0],
                        room: group.$(".room [href*='/room/']")?.text ?? get(scheduleParams).value,
                        group: group.$(".classGroup .group")?.text.match(/\d+\.sk/)[0],
                        id: Symbol(),
                        subjectAbbr: group.$("strong")?.text.trim(),
                        teacherAbbr,
                        changed: group.classList.contains("zmena"),
                        teacher
                    });
                });

                subjects.push(subject);
            } else {
                subjects.push([{}]);
            }
        });

        subjects.push([{}], [{}], [{}]); // padding
        daySchedule.push({ day, subjects });
    });

    return daySchedule;
}

export async function parseWebScheduleMetadata(response) {
    let temp = createElement((await response).contents);

    let classes = [];
    let rooms = [];
    let teachers = [];

    temp.$$("#tt+.links a[href*='/class/']").forEach((e) => classes.push(e.text));
    temp.$$("#tt+.links+.links a[href*='/room/']").forEach((e) => rooms.push({ abbr: e.text, name: e.text }));
    temp.$$("#tt+.links+.links+.links a[href*='/teacher/']").forEach((e) => teachers.push({ abbr: e.text, name: e.title }));

    return { classes, rooms, teachers };
}

export function setURL(path = "/", parameters) {
    if (get(config).updateURL) {
        parameters = new URLSearchParams(parameters).toString().replaceAll(/=(?=$|&)/g, "");
        window.history.pushState(null, "", location.origin + path + parameters ? "?" + parameters : "");
    }
}

export function readURL(url) {
    let params = new URL(url).searchParams;
    return {
        class: params.get("cls"),
        mode: Array.from(params.keys())[0],
        type: params.get("type"),
        value: params.get("value")
    };
}

export function getPosition(element) {
    return {
        size: element.getBoundingClientRect(),
        get x() {
            return this.size.left + this.size.width / 2;
        },
        get y() {
            return this.size.top + this.size.height / 2;
        },
        get windowWidth() {
            return window.innerWidth;
        },
        get windowHeight() {
            return window.innerHeight;
        },
        get windowX() {
            return this.windowWidth / 2;
        },
        get windowY() {
            return this.windowHeight / 2;
        },
        get containerSize() {
            return document.body.children[0].getBoundingClientRect();
        }
    };
}
