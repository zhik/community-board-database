<script>
  import { tick } from 'svelte'
  import { Field } from 'svelma'
  import Select from 'svelte-select'
  import { contacts } from '../stores'
  import inObj from '../utils/inObj'

  export let value
  export let id
  export let label
  let selectedValue = undefined
  $: {
    if (selectedValue) {
      value = selectedValue.map(item => item.id)
    }
  }

  const optionIdentifier = 'id'
  const getOptionLabel = option => option.label
  const getSelectionLabel = option => option.label

  function loadOptions(filter) {
    //todo - filter for agency only ??
    const filter_string = filter.toLowerCase()
    const items = $contacts.map(({ id, json }) => {
      return {
        id: id,
        label: inObj(json, 'Name', '<blank>'),
        group: 'Type' in json ? json['Type'].join(',') : ''
      }
    })
    if (filter_string) {
      return items.filter(item => item.label.toLowerCase().includes(filter_string))
    } else {
      return items.slice(0, 10)
    }
  }
</script>

<Field {label}>
  <Select
    {loadOptions}
    {optionIdentifier}
    {getOptionLabel}
    {getSelectionLabel}
    isMulti="{true}"
    bind:selectedValue
    placeholder="Search for Contacts"
  />
</Field>
