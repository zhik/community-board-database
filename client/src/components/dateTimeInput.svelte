<style>
  #input-date {
    margin-right: 1em;
  }
</style>

<script>
  import dateFormat from '../utils/dateFormat'

  export let datetime
  export let initDateTime = new Date()
  export let id
  export let label

  let date = initDateTime ? dateFormat(initDateTime, 'yyyy-mm-dd') : undefined
  let time = initDateTime ? dateFormat(initDateTime, 'hh:MM') : undefined

  $: {
    if (date && time) {
      datetime = `${date}T${time}:00.000Z`
    } else {
      datetime = null
    }
  }
</script>

<label for="{id}" class="{id} label">{label}</label>
<div class="field">
  <input id="input-date" min="2000-01-01" type="date" bind:value="{date}" aria-label="{label}" />
  <input id="input-time" type="time" bind:value="{time}" aria-label="{label}" />
</div>
