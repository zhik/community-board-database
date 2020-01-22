<style>
  .form-panel {
  }

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
  import { Field, Input, Button } from 'svelma'
  import DateTimeInput from '../components/dateTimeInput.svelte'
  import OrganizationSelect from '../components/organizationSelect.svelte'
  import ContactSelect from '../components/contactSelect.svelte'
  import AddressSearch from '../components/addressSearch.svelte'
  import { navigateTo } from 'svelte-router-spa'

  //todo- fix label for - a11y for svelma
  let statuses = ['Open', 'Closed']

  let form = {
    Status: statuses[0],
    'Request/Issue': '',
    'Date Opened': null,
    'Initial Note': '',
    'Primary Agency': [],
    'Requester Name': [],
    'Issue Full Address': '',
    'Additional Location Info': ''
  }

  let disabled = false

  async function handleSubmit() {
    fetch(`http://localhost:5000/requests`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        //redirect
        setTimeout(() => {
          navigateTo(`/browse/request/${data.id}`)
        }, 100)
      })
      .catch(err => {
        //error message
        disabled = false
        console.log('failed update', err.message)
      })
  }
</script>

<h3 class="title is-3">Create Request</h3>
<h6 class="subtitle is-6">Add a new request to the database</h6>

<form on:submit|preventDefault="{handleSubmit}">
  <div class="form-panel">
    <div class="panel-top">
      <div class="panel2-left">
        <Field label="Status">
          <div class="select">
            <select bind:value="{form['Status']}">
              {#each statuses as status}
                <option value="{status}">{status}</option>
              {/each}
            </select>
          </div>
        </Field>
        <DateTimeInput label="Date Opened" id="date-opened" bind:datetime="{form['Date Opened']}" />
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

        <Field label="Request/Issue" for="request-issue">
          <textarea
            id="request-issue"
            name="request-issue-text"
            class="textarea"
            bind:value="{form['Request/Issue']}"
            rows="3"
          ></textarea>
        </Field>
        <Field label="Initial Note" for="initial-note">
          <textarea
            id="initial-note"
            name="initial-note-text"
            class="textarea"
            bind:value="{form['Initial Note']}"
            rows="4"
          ></textarea>
        </Field>

      </div>
      <div class="panel2-right">
        <AddressSearch
          label="Issue Full Address"
          id="issue-full-dddress"
          bind:value="{form['Issue Full Address']}"
        />
        <Field label="Additional Location Info">
          <textarea
            id="additional-location-info"
            name="additional-location-info"
            class="textarea"
            bind:value="{form['Additional Location Info']}"
            rows="2"
          ></textarea>
        </Field>
      </div>
    </div>
    <div class="panel-bottom">
      <Button {disabled} type="is-primary" size="is-medium" nativeType="submit">Submit</Button>

    </div>
  </div>
</form>
