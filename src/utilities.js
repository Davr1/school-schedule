import { fetchCount } from "./mainStore";
import { scheduleParams } from "./configStore";
import { config } from "./configStore";
import { get } from "svelte/store";
import { encode } from "windows-1250";

HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype["forEach"] = Array.prototype.forEach;
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
NodeList.prototype["find"] = Array.prototype.find;

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
    let schedule = [];
    let temp = new DOMParser().parseFromString(await response, "text/html");
    temp.querySelectorAll(".bk-timetable-row").forEach((row) => {
        let subjects = [];
        let date = [row.querySelector(".bk-day-day").textContent, row.querySelector(".bk-day-date").textContent];
        row.querySelectorAll(".bk-timetable-cell").forEach((cell) => {
            let subject = [];
            cell.querySelectorAll(".day-item-hover").forEach((group) => {
                subject.push({
                    ...JSON.parse(group.dataset.detail),
                    id: Symbol(),
                    subjectAbbr: group.querySelector(".middle")?.textContent.trim(),
                    teacherAbbr: group.querySelector(".bottom>span")?.textContent.trim(),
                    changed: Boolean(group.classList.contains("pink"))
                });
            });
            if (cell.children.length === 0) {
                subject.push({});
            }
            if (cell.querySelector(".empty")) {
                subject.push({
                    special: cell.querySelector("span")?.textContent.trim(),
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
    let daySchedule = [];
    let temp = new DOMParser().parseFromString((await response).contents, "text/html");
    temp.querySelectorAll(".table-responsive tbody tr:not(.prvniradek):nth-child(2n)").forEach((row) => {
        let cls = row.firstChild.textContent;
        let subjects = [];
        let firstHalf = Array.from(row.querySelectorAll("td:not(:first-of-type, .heightfix)"));
        let secondHalf = Array.from(row.nextElementSibling.querySelectorAll("td:not(.heightfix)"));
        firstHalf.forEach((cell) => {
            if (cell.childNodes[0].textContent.replace(/\s+/, "")) {
                let subject = [];
                let group = "";
                if (cell.querySelector("strong")?.nextSibling?.nodeName === "#text") {
                    group = cell.querySelector("strong").nextSibling.textContent.match(/\d+\.sk/)[0];
                } else if (cell.firstChild.nodeName === "#text" && /\d+\.sk/.test(cell.firstChild.textContent)) {
                    group = cell.firstChild.textContent.match(/\d+\.sk/)[0];
                }
                subject.push({
                    room: cell.querySelector("[href*='/room/']")?.textContent,
                    group,
                    id: Symbol(),
                    subjectAbbr: cell.querySelector("strong")?.textContent,
                    teacherAbbr: cell.querySelector("[href*='/teacher/']")?.textContent,
                    changed: true
                });
                if (cell.rowSpan === 1) {
                    let alternativeGroup = secondHalf.shift();
                    let group2 = "";
                    if (alternativeGroup.querySelector("strong")?.nextSibling?.nodeName === "#text") {
                        group2 = alternativeGroup.querySelector("strong").nextSibling.textContent.match(/\d+\.sk/)[0];
                    }
                    subject.push({
                        room: alternativeGroup.querySelector("[href*='/room/']")?.textContent,
                        group: group2,
                        id: Symbol(),
                        subjectAbbr: alternativeGroup.querySelector("strong")?.textContent,
                        teacherAbbr: alternativeGroup.querySelector("[href*='/teacher/']")?.textContent,
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
    let daySchedule = [];
    let temp = new DOMParser().parseFromString((await response).contents, "text/html");
    temp.querySelectorAll(".day").forEach((row) => {
        let day = row.querySelector(".dayTitle").textContent.match(/\S+/)[0];
        let subjects = [];
        row.querySelectorAll(".hour:not(.dayTitle)").forEach((cell) => {
            if (!cell.classList.contains("group0")) {
                let subject = [];
                cell.querySelectorAll("div.group").forEach((group) => {
                    let teacherAbbr;
                    if (get(scheduleParams).type === "teacher") {
                        teacherAbbr = get(scheduleParams).value;
                    } else if (get(scheduleParams).type === "room") {
                        teacherAbbr = group.querySelector(".teacher a")?.textContent.match(/\S+/)[0];
                    }
                    let teacher = temp.querySelectorAll(".links a").find((a) => a.textContent.trim() === teacherAbbr)?.title;
                    subject.push({
                        cls: group.querySelector("[href*='/class/']")?.textContent.match(/\S+/)[0],
                        room: group.querySelector(".room [href*='/room/']")?.textContent ?? get(scheduleParams).value,
                        group: group.querySelector(".classGroup .group")?.textContent.match(/\d+\.sk/)[0],
                        id: Symbol(),
                        subjectAbbr: group.querySelector("strong")?.textContent.trim(),
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
    let temp = new DOMParser().parseFromString((await response).contents, "text/html");
    let classes = [];
    let rooms = [];
    let teachers = [];
    temp.querySelectorAll("#tt+.links a[href*='/class/']").forEach((e) => classes.push(e.textContent.trim()));
    temp.querySelectorAll("#tt+.links+.links a[href*='/room/']").forEach((e) =>
        rooms.push({ abbr: e.textContent.trim(), name: e.textContent.trim() })
    );
    temp.querySelectorAll("#tt+.links+.links+.links a[href*='/teacher/']").forEach((e) =>
        teachers.push({ abbr: e.textContent.trim(), name: e.title })
    );

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
        get parentSize() {
            return document.querySelector("body>:first-child").getBoundingClientRect();
        }
    };
}
