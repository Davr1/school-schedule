<script>
    export let data;

    let date = new Date(data.end);
</script>

<h1>Enjoy the holidays!</h1>
<h2>
    The schedule will be back by
    <strong>
        {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
    </strong>
</h2>
