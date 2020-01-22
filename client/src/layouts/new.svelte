<style>
  form {
    display: flex;
    flex-wrap: wrap;
  }

  .panel-left {
    flex: 1 1 auto;
    min-width: 30em;
    margin-right: 1em;
  }

  .panel-right {
    margin-top: 1em;
    flex: 1 1 auto;
    min-width: 20em;
    height: 30em;
  }

  textarea {
    width: 30em;
    height: 5em;
  }
</style>

<script>
  import { Field, Input } from 'svelma'
  import DateTimeInput from '../components/dateTimeInput.svelte'
  import Leaflet from '../components/leaflet.svelte'

  //todo- fix label for - a11y for svelma
  let statuses = ['Open', 'Closed']

  let form = {
    Status: statuses[0],
    'Request/Issue': '',
    'Date Opened': null,
    'Initial Note': ''
  }

  $: console.log(form)

  async function handleSubmit() {
    console.log('submitted')
    //redirect to issue page
  }
</script>

<h3 class="title is-3">Create Request</h3>
<h6 class="subtitle is-6">Add a new request to the database</h6>

<form on:submit|preventDefault="{handleSubmit}">

  <div class="panel-left">
    <Field label="Status">
      <div class="control">
        <div class="select">
          <select bind:value="{form['Status']}">
            {#each statuses as status}
              <option value="{status}">{status}</option>
            {/each}
          </select>
        </div>
      </div>
    </Field>
    <DateTimeInput label="Date Opened" id="date-opened" bind:datetime="{form['Date Opened']}" />
    <Field label="Request/Issue" for="request-issue">
      <textarea
        id="request-issue"
        name="request-issue-text"
        class="textarea"
        bind:value="{form['Request/Issue']}"
      ></textarea>
    </Field>
    <Field label="Initial Note" for="initial-note">
      <textarea
        id="initial-note"
        name="initial-note-text"
        class="textarea"
        bind:value="{form['Initial Note']}"
      ></textarea>
    </Field>
  </div>
  <div class="panel-right">
    <Leaflet />

  </div>
</form>
