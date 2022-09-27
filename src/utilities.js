import { fetchCount } from "./mainStore";

export function fetchBaka(data) {
    return fetch(`https://is.sssvt.cz/IS/Timetable/Public/${data.mode}/Class/${data.class.id}`).then((response) => {
        if (response.ok) {
            fetchCount.update(() => 1);
            return response.text();
        }
    });
}

export function fetchCORSless(url, charset = "utf-8") {
    return fetch(`https://api.allorigins.win/get?charset=${charset}&url=${encodeURIComponent("https://" + url)}`).then((response) => {
        if (response.ok) {
            fetchCount.update((v) => v++);
            return response.json();
        }
    });
}

export async function parseSchedule(response) {
    let schedule = [];
    let temp = document.createElement("div");
    temp.innerHTML = await response;
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
    temp.remove();
    return schedule;
}

export function setURL(path = "/", parameters) {
    parameters = new URLSearchParams(parameters).toString().replaceAll(/=(?=$|&)/g, "");
    window.history.pushState(null, "", location.origin + path + parameters ? "?" + parameters : "");
}
