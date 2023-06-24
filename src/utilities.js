import { get } from "svelte/store";
import { encode } from "windows-1250";
import { config, scheduleParams } from "./configStore";
import { templates, toBakaParams, urls } from "./staticStore";

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
    return fetch(`${urls.baka}/Timetable/Public/${data.weekMode}/${data.scheduleMode}/${data.value}`).then((response) => {
        if (response.ok) return response.text();
    });
}

/**
 * Fetch the substitution schedule from sssvt.cz
 *
 * Note: This uses the proxy endpoint
 * @param {Date} date The date to fetch the schedule for
 * @returns {Promise<string>} The schedule as a UTF-8 string
 */
export async function fetchWebSchedule(date) {
    const formattedDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");

    // Fetch the schedule from the school's server
    const response = await fetch(`${urls.substitution}/${formattedDate}`);

    // If the response is not OK, throw an error
    if (!response.ok) throw new Error("Failed to fetch schedule");

    return response.text();
}

/**
 * Fetch the teacher / room schedule
 *
 * Note: also uses the proxy endpoint
 * @param {string} mode The mode to fetch the schedule for (ig)
 * @param {string} value
 * @param {boolean} sub Whether to fetch the substitution schedule
 * @returns {Promise<string>} The schedule as a UTF-8 string
 */
export async function fetchWebScheduleAlt(mode, value, sub) {
    let encodedValue = Array.from(encode(value))
        .map((v) => "%25" + v.toString(16))
        .join("");

    const response = await fetch(`${urls.schedule}/${mode}/${encodedValue}/${sub ? "suplovaci" : ""}`);

    // If the response is not OK, throw an error
    if (!response.ok) throw new Error("Failed to fetch schedule");

    return response.text();
}

// Empty schedule, only used for getting teacher and room ids
export function fetchWebScheduleMetadata() {
    return fetch(`${urls.schedule}/class/`).then((response) => {
        if (response.ok) {
            return response.json();
        }
    });
}

export async function getBakaSchedule(params) {
    let temp = createElement(await fetchBaka(toBakaParams(params)));

    let schedule = [];

    temp.$$(".bk-timetable-row").forEach((row) => {
        let date = [row.$(".bk-day-day").text, row.$(".bk-day-date").text];
        let subjects = [];

        row.$$(".bk-timetable-cell").forEach((cell) => {
            let subject = [];

            cell.$$(".day-item-hover").forEach((group) => {
                let data = JSON.parse(group.dataset.detail);
                let subjectInstance;

                switch (data.type) {
                    case "removed":
                        subjectInstance = new templates.EmptySubject({
                            changed: true,
                            changeInfo: data.removedinfo
                        });
                        break;
                    case "absent":
                        subjectInstance = new templates.SpecialSubject({
                            special: data.InfoAbsentName,
                            specialAbbr: data.absentinfo,
                            changeInfo: data.removedinfo
                        });
                        break;
                    default:
                        subjectInstance = new templates.StandardSubject({
                            subject: data.subjecttext.split("|")[0].trim(),
                            subjectAbbr: group.$(".middle")?.text,
                            teacher: data.teacher,
                            teacherAbbr: group.$(".bottom>span")?.text ?? "",
                            room: data.room,
                            group: data.group,
                            theme: data.theme,
                            changed: group.classList.contains("pink"),
                            changeInfo: data.changeinfo
                        });
                }

                subject.push(subjectInstance);
            });

            if (cell.children.length === 0) {
                subject.push(new templates.EmptySubject());
            }

            if (cell.$(".empty")) {
                subject.push(
                    new templates.SpecialSubject({
                        special: cell.$("span")?.text
                    })
                );
            }

            subjects.push(subject);
        });

        schedule.push({ subjects, date });
    });

    return schedule;
}

export async function getWebSchedule(date) {
    let temp = createElement(await fetchWebSchedule(date));

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

                if (cell.$("strong")) {
                    subject.push(
                        new templates.StandardSubject({
                            room: cell.$("[href*='/room/']")?.text,
                            group,
                            subjectAbbr: cell.$("strong")?.text,
                            teacherAbbr: cell.$("[href*='/teacher/']")?.text,
                            changed: true
                        })
                    );
                } else {
                    subject.push(
                        new templates.EmptySubject({
                            changed: true
                        })
                    );
                }

                if (cell.rowSpan === 1) {
                    let alternativeGroup = secondHalf.shift();
                    let group2 = "";

                    if (alternativeGroup.$("strong")?.next?.nodeName === "#text") {
                        group2 = alternativeGroup.$("strong").next.text.match(/\d+\.sk/)[0];
                    }

                    subject.push(
                        new templates.StandardSubject({
                            room: alternativeGroup.$("[href*='/room/']")?.text,
                            group: group2,
                            subjectAbbr: alternativeGroup.$("strong")?.text,
                            teacherAbbr: alternativeGroup.$("[href*='/teacher/']")?.text,
                            changed: true
                        })
                    );
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
            return (document.querySelector(".modal-content") ?? document.body).getBoundingClientRect();
        }
    };
}
