<script lang="ts">
    const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // month is zero-based
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formatted = dd + '.' + mm + '.' + yyyy;

    console.log(formatted);
</script>