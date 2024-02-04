<script lang="ts">
    import { TeacherDetail } from "@school-schedule/api/classes";

    export let data;
</script>

<h1>{data.week} - {data.detail instanceof TeacherDetail ? data.detail.fullName : data.detail.name}</h1>
