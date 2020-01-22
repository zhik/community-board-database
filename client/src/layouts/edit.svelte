<style>
  .panel-top {
    display: flex;
    flex-wrap: wrap;
  }

  .panel-bottom {
    margin-top: 1em;
  }

  .panel2-left {
    flex: 1 1 auto;
    min-width: 30em;
    margin-right: 1em;
  }

  .panel2-right {
    flex: 2 1 auto;
    min-width: 25em;
    margin: 1em auto 0em auto;
  }
</style>

<script>
  import { Snackbar } from 'svelma'
  import Button from 'svelma/src/components/Button.svelte'
  import DateTimeInput from '../components/dateTimeInput.svelte'
  import OrganizationSelect from '../components/organizationSelect.svelte'
  import ContactSelect from '../components/contactSelect.svelte'
  import AddressSearch from '../components/addressSearch.svelte'
  import { navigateTo } from 'svelte-router-spa'
  import { onMount } from 'svelte'

  export let currentRoute
  let statuses = ['Open', 'Closed']
  let form
  let location
  let loading = false

  onMount(async () => {
    //load form data from endpoint
    const data = await fetch(`http://localhost:5000/requests/${currentRoute.namedParams.id}`)
      .then(res => res.json())
      .then(data => {
        data.json = JSON.parse(data.json)
        return data
      })

    let defaults = {
      Status: statuses[0],
      'Request/Issue': '',
      'Date Opened': null,
      'Initial Note': '',
      'Primary Agency': [],
      'Requester Name': [],
      'Issue Full Address': '',
      'Additional Location Info': ''
    }
    location = { type: 'Feature', properties: { label: data.address }, geometry: data.location }

    //merge defaults and data.json
    Object.keys(defaults).map(key => {
      if (key in data.json) {
        defaults[key] = data.json[key]
      }
    })
    form = defaults
  })

  let disabled = false

  async function handleSubmit() {
    loading = true
    await fetch(`http://localhost:5000/requests/${currentRoute.namedParams.id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .catch(err => {
        //error message
        console.log('failed update', err.message)
      })
    disabled = false
    setTimeout(() => {
      loading = false
      Snackbar.create({
        message: 'Updated',
        type: 'is-white',
        position: 'is-top-right',
        duration: 1000
      })
    }, 500)
  }
</script>

<h3 class="title is-3">Request</h3>
<h6 class="subtitle is-6">{currentRoute.namedParams.id}</h6>

{#if form}
  <form on:submit|preventDefault="{handleSubmit}">
    <div class="form-panel">
      <div class="panel-top">
        <div class="panel2-left">
          <div class="field">
            <label for="status" class="label">Status</label>
            <div class="select">
              <select bind:value="{form['Status']}">
                {#each statuses as status}
                  <option value="{status}">{status}</option>
                {/each}
              </select>
            </div>
          </div>
          <DateTimeInput
            label="Date Opened"
            id="date-opened"
            initDateTime="{form['Date Opened']}"
            bind:datetime="{form['Date Opened']}"
          />
          <OrganizationSelect
            label="Primary Agency"
            id="primary-agency"
            bind:value="{form['Primary Agency']}"
          />
          <ContactSelect
            label="Requester Name"
            id="requester-name"
            bind:value="{form['Requester Name']}"
          />
          <div class="field">
            <label for="request-issue" class="label">Request/Issue</label>
            <textarea
              id="request-issue"
              name="request-issue-text"
              class="textarea"
              bind:value="{form['Request/Issue']}"
              rows="3"
            ></textarea>
          </div>
          <div class="field">
            <label for="initial-note" class="label">Initial Note</label>
            <textarea
              id="initial-note"
              name="initial-note-text"
              class="textarea"
              bind:value="{form['Initial Note']}"
              rows="4"
            ></textarea>
          </div>

        </div>
        <div class="panel2-right">
          <AddressSearch
            label="Issue Full Address"
            id="issue-full-dddress"
            initLocation="{location}"
            bind:value="{form['Issue Full Address']}"
          />
          <div class="field">
            <label for="additional-location-info" class="label">Additional Location Info</label>
            <textarea
              id="additional-location-info"
              name="additional-location-info"
              class="textarea"
              bind:value="{form['Additional Location Info']}"
              rows="2"
            ></textarea>
          </div>

        </div>
      </div>
      <div class="panel-bottom">
        <Button {disabled} {loading} type="is-primary" size="is-medium" nativeType="submit">
          Update
        </Button>

      </div>
    </div>
  </form>
{:else}
  <p>...loading</p>
{/if}
