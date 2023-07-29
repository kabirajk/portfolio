<script>
// @ts-nocheck

  import Roronoa_zoro from "$lib/images/Roronoa_zoro.gif";
  import jiraya from "$lib/images/jiraya.gif";
  import brook from "$lib/images/brook.gif";
  import kakarot_ultra_instinct from "$lib/images/kakarot_ultra_instinct.gif";
  import sanji_flambage_shot from "$lib/images/sanji_flambage_shot.gif";
  import kakshi_team from "$lib/images/kakshi_team.gif";
  import zoro_ashura from "$lib/images/zoro_ashura.gif";
  import Ace from "$lib/images/Ace.gif";
  
  let startWith = 'R';
  let src = Roronoa_zoro;
  let gitfMap= {'K':[kakshi_team,kakarot_ultra_instinct],
                "A":[Ace],
                "B":[brook],
                "I":[sanji_flambage_shot],
                "R":[Roronoa_zoro,zoro_ashura],
                "A":[Ace],
                "J":[jiraya]
              };
  /**
   * @param {Object} event
   * @param {HTMLElement} event.target  
  */
  function gifchooser(event){
    let element = event.target;
    if(element){
      let starts = element.getAttribute('data-starts');
      if(gitfMap[''+starts].length){
        let gif = gitfMap[''+starts][getRandomInt(gitfMap[''+starts].length)];
        src = gif
      }
    }
  }
  function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
</script>

<section>
  <div class="image-wrapper">
    <img {src} alt="" />
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <span  on:mouseover={gifchooser} class="ui-font-size">
    <div data-starts="K" class="word">K</div>
    <div data-starts="A" class="word">A</div>
    <div data-starts="B" class="word">B</div>
    <div data-starts="I" class="word">I</div>
    <div data-starts="R" class="word">R</div>
    <div data-starts="A" class="word">A</div>
    <div data-starts="J" class="word">J</div>
  </span>
</section>

<style>
  section {
    display: block;
    width: 100vw;
    height: 100vh;
  }
  span {
    display: flex;
    justify-content: center;
    /* font-size: 6em; */
    /* min-height: 100vh; */
    align-items: center;
    text-shadow: 0px 0px 20px var(--color-text);
    position: relative;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img {
    width:370px;
    aspect-ratio:16/9;
    object-fit: contain;
  }
  .word {
    transition: 0.5s linear(-0.13 -6.59%, 1.02 78.54%, 1 100%);
  }
  .word:hover {
    transform: scale(1.2);
  }
  .image-wrapper{
    width:370px;
    aspect-ratio:16/9;
    position: relative;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
