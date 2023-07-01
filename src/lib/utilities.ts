import { fetchWebSchedule } from "$lib/data";
import { EmptySubject, StandardSubject } from "$lib/subject";

import type { Value } from "$stores/config";
import { scheduleMetadata } from "$stores/static";

// TODO: Remove this
function createElement(el: any) {
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

function functionProxy(original: any, modify: any) {
    return new Proxy(original, {
        apply: function (target, thisArg, argList) {
            return modify(Reflect.apply(target, thisArg, argList));
        }
    });
}

const elementProxy: any = {
    get: function (target: any, property: any) {
        let temp, proxied;
        switch (property) {
            case "$":
            case "querySelector":
                proxied = functionProxy(target.querySelector, (a: any) => createElement(a));
                break;
            case "$$":
            case "querySelectorAll":
                proxied = functionProxy(target.querySelectorAll, (a: any) => Array.from(a).map((e) => createElement(e)));
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

/** WARNING: Untyped! */
export async function getWebSchedule(date: Date) {
    let temp = createElement(await fetchWebSchedule(date));

    // Note: Only types Standard and Empty can be returned
    //       Also the types here are god awful... (as one could've guessed from the warning above)
    let daySchedule: { cls: string; subjects: (StandardSubject | EmptySubject)[][] }[] = [];

    temp.$$(".table-responsive tbody tr:not(.prvniradek):nth-child(2n)").forEach((row: any) => {
        let cls: string = row.firstChild.text;
        let subjects: (StandardSubject | EmptySubject)[][] = [];

        let firstHalf = row.$$("td:not(:first-of-type, .heightfix)");
        let secondHalf = row.nextEl.$$("td:not(.heightfix)");

        firstHalf.forEach((cell: any) => {
            if (cell.childNodes[0].text.replace(/\s+/, "")) {
                let subject: (StandardSubject | EmptySubject)[] = [];
                let group = "";

                if (cell.$("strong")?.next?.nodeName === "#text") {
                    group = cell.$("strong").next.text.match(/\d+\.sk/)[0];
                } else if (cell.firstChild.nodeName === "#text" && /\d+\.sk/.test(cell.firstChild.text)) {
                    group = cell.firstChild.text.match(/\d+\.sk/)[0];
                }

                if (cell.$("strong")) {
                    subject.push(
                        new StandardSubject({
                            room: cell.$("[href*='/room/']")?.text,
                            group,
                            subjectAbbr: cell.$("strong")?.text,
                            teacherAbbr: cell.$("[href*='/teacher/']")?.text,
                            changed: true
                        })
                    );
                } else {
                    subject.push(
                        new EmptySubject({
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
                        new StandardSubject({
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

export function getPosition(element: HTMLElement) {
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

export function isValidMetadata(value: string): value is Value {
    return (
        scheduleMetadata.classes.find((classMetadata) => classMetadata.name === value) !== undefined ||
        scheduleMetadata.rooms.find((roomMetadata) => roomMetadata.name === value) !== undefined ||
        scheduleMetadata.teachers.find((teacherMetadata) => teacherMetadata.name === value || teacherMetadata.abbr === value) !== undefined
    );
}
