<script>
    export let subject = {};
    let room = subject.room ?? "";
    let teacher = subject.teacher ?? "";
    let theme = subject.theme ?? "";
    let subjectText = subject.subjecttext ?? "";
    let subjectAbbr = subject.subjectAbbr ?? "";
    let teacherAbbr = subject.teacherAbbr ?? "";
    let group = subject.group ?? "";
    let changed = subject.changed;
    let changeInfo = subject.changeInfo;
    let specialChange = subject.special;
    let title =
        specialChange ??
        [
            `${theme ? theme + "\n\n" : ""}${subjectText}`,
            `${teacher}`,
            `${changed && changeInfo ? changeInfo : room}${group ? " - " + group : ""}`
        ]
            .filter((e) => e)
            .join("\n");
</script>

<div class="group" class:changed class:changed2={subject.special} {title}>
    <div class="group-content">
        <div class="top">
            <div class="left">{group}</div>
            <div class="right">{room}</div>
        </div>
        <div class="middle">{specialChange ?? subjectAbbr}</div>
        <div class="bottom">{teacherAbbr}</div>
    </div>
</div>
