import * as React from 'react'
import * as uuid from 'uuid-random'

import { AsyncSearchSelect, ISelectItem } from '@skedulo/sked-ui'

import { shareServices } from '../../services/ShareServices'
import { PlaceDetail } from '../../types/geoservices'

interface AddressAutocompleteProps {
  value?: string | null
  onChange: (address: PlaceDetail | null) => void
}


const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ value, onChange }) => {
  const sessionId = React.useMemo(() => uuid(), [])

  const onAddressSelected = React.useCallback(async (selected: ISelectItem) => {
    if (selected?.value) {
      try {
        const resp = await shareServices.fetchPlaceDetail(selected.value, sessionId)
        onChange(resp)
      } catch (error) {
        onChange(null)
      }
    }
  }, [onChange, sessionId])

  const fetchPredictions = React.useCallback(async (input: string) => {
    try {
      const resp = await shareServices.fetchAddressAutocomplete(input, sessionId)
      return resp.map(item => ({ value: item.placeId, label: item.description }))
    } catch (error) {
      return []
    }
  }, [sessionId])

  return (
    <AsyncSearchSelect
      fetchItems={fetchPredictions}
      name="AddressAutocomplete"
      selectedItem={value ? { value: value, label: value } : undefined}
      onSelectedItemChange={onAddressSelected}
      fetchStrategy="onMinChars"
      minChars={3}
    />
  )
}

export default AddressAutocomplete
