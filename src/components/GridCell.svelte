<script>
    export let subject = {};
    let room = subject.room ?? "";
    let subjectAbbr = subject.subjectAbbr ?? "";
    let teacherAbbr = subject.teacherAbbr ?? "";
    let group = subject.group ?? "";
    let changed = subject.changed;
    let specialChange = subject.special;
</script>

<div class="group" class:changed class:changed2={subject.special}>
    <div class="group-content">
        <div class="top">
            <div class="left">{group}</div>
            <div class="right">{room}</div>
        </div>
        <div class="middle">{specialChange ?? subjectAbbr}</div>
        <div class="bottom">{teacherAbbr}</div>
    </div>
</div>
