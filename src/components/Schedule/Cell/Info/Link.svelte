<script lang="ts">
    import { TeacherDetail, type AnyDetail } from "@school-schedule/api/classes";

    import styles from "$styles/modules/Schedule.module.scss";

    export let detail: AnyDetail;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a class={styles.link}>
    {detail instanceof TeacherDetail ? detail.fullName : detail.name ?? detail.id}
</a>
