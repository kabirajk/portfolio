<script>
    import luffypistol from '$lib/images/luffypistol.gif';
</script>
<span>
    <a href="/">K</a>
    <img src="{luffypistol}" alt="">
</span>
<style>
    img{
        height: 45px;
        transform: scale(-1,1);
    }
    span{
        font-size: 2em;
    }
    a{
        position: absolute;
        font-size: 50px;
        /* animation-name: pistol;
        animation-duration: 2s;
        animation-timing-function: cubic-bezier(0, 0.94, 0, 1.05);
        animation-fill-mode: none;
        animation-iteration-count: infinite;
        animation-delay: 1.5s; */
    }
    @keyframes pistol{
        0%{
            opacity: 1;
            transform: translateX(-100px);
        }
        99%{
            opacity: 1;
            transform: translateX(20px);
        }
        100%{
            opacity: 0;
        }
    }
</style>