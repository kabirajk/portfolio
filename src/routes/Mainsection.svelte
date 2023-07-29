
<script>
    import Roronoa_zoro from '$lib/images/Roronoa_zoro.gif';
</script>
<section>
    <img src="{Roronoa_zoro}" alt="">
    <span class="ui-font-size">
        <div class="word">K</div>
        <div class="word">A</div>
        <div class="word">B</div>
        <div class="word">I</div>
        <div class="word">R</div>
        <div class="word">A</div>
        <div class="word">J</div>
    </span>
</section>
<style>
    section{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    span{
        display: flex;
        justify-content: center;
        /* font-size: 6em; */
        /* min-height: 100vh; */
        align-items: center;
        text-shadow: 0px 0px 20px var(--color-text);
    }
    img{
        width: 300px;
        aspect-ratio: 1;
    }
    .word{
        transition:0.5s linear(-0.13 -6.59%, 1.02 78.54%, 1 100%);
    }
    .word:hover{
        transform: scale(1.2);
    }
</style>