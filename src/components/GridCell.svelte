<script>
    export let subject = {};
    let room = subject.room ?? "";
    let subjectAbbr = subject.subjectAbbr ?? "";
    let teacherAbbr = subject.teacherAbbr ?? "";
    let group = subject.group ?? "";
    let changed = subject.changed;
</script>

<div class="group" class:changed>
    <div class="group-content">
        <div class="top">
            <div class="left">{group}</div>
            <div class="right">{room}</div>
        </div>
        <div class="middle">{subjectAbbr}</div>
        <div class="bottom">{teacherAbbr}</div>
    </div>
</div>
