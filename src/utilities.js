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
        let day = [];
        row.querySelectorAll(".bk-timetable-cell").forEach((cell) => {
            let subject = [];
            cell.querySelectorAll(".day-item-hover").forEach((group) => {
                let metadata = JSON.parse(group.dataset.detail);
                metadata.id = Symbol();
                metadata.subjectAbbr = group.querySelector(".middle")?.textContent.trim();
                metadata.teacherAbbr = group.querySelector(".bottom>span")?.textContent.trim();
                metadata.changed = Boolean(group.classList.contains("pink"));
                subject.push(metadata);
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
            day.push(subject);
        });
        schedule.push(day);
    });
    temp.remove();
    return schedule;
}
