<script lang="ts">
    import GameEnd from "$lib/GameEnd.svelte";
    let correctCount = 4;
    let correctWords = ["word1", "word2", "word3"];
    let lastWord = "word4";
</script>

<GameEnd {correctCount} {correctWords} {lastWord} />