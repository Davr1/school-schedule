import { fetchCount } from "./mainStore";

export function fetchBaka(data) {
    return fetch(`https://is.sssvt.cz/IS/Timetable/Public/${data.mode}/Class/${data.class.id}`).then((response) => {
        if (response.ok) {
            fetchCount.update(() => 1);
            return response.text();
        }
    });
}

export function fetchWebSchedule(date) {
    return fetch(
        `https://api.allorigins.win/get?charset=windows-1250&url=${encodeURIComponent(
            "https://www.sssvt.cz/main.php?p=IS&pp=suplak&datum=" + date
        )}`
    ).then((response) => {
        if (response.ok) {
            fetchCount.update((v) => (v += 1));
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

export function setURL(path = "/", parameters) {
    parameters = new URLSearchParams(parameters).toString().replaceAll(/=(?=$|&)/g, "");
    window.history.pushState(null, "", location.origin + path + parameters ? "?" + parameters : "");
}
