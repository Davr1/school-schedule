import { fetchWebSchedule } from "$lib/data";

import { EmptySubject, StandardSubject, Subject } from "$stores/static";

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

/** WARNING: Untyped! */
export async function getWebSchedule(date) {
    let temp = createElement(await fetchWebSchedule(date));

    let daySchedule: { cls: string; subjects: Subject[][] }[] = [];

    temp.$$(".table-responsive tbody tr:not(.prvniradek):nth-child(2n)").forEach((row) => {
        let cls: string = row.firstChild.text;
        let subjects: Subject[][] = [];

        let firstHalf = row.$$("td:not(:first-of-type, .heightfix)");
        let secondHalf = row.nextEl.$$("td:not(.heightfix)");

        firstHalf.forEach((cell) => {
            if (cell.childNodes[0].text.replace(/\s+/, "")) {
                let subject: Subject[] = [];
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
