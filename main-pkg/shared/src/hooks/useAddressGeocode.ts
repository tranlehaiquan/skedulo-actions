import React from 'react'

import { shareServices } from '../services/ShareServices'

interface AddressGeocode {
  address: string | undefined
  lat: number | null
  lng: number | null
}

export function useAddressGeocode (address: string | undefined) {
  const [addressGeocode, setAddressGeocode] = React.useState<AddressGeocode>({
    address,
    lat: null,
    lng: null
  })

  React.useEffect(() => {
    if (!address) {
      // no address, remove all address related field
      setAddressGeocode({
        address,
        lat: null,
        lng: null
      })
    } else {
      let isClear
      (async () => {
        const result = await shareServices.fetchAddressGeocode(address)

        if (!isClear) {
          setAddressGeocode(result)
        }
      })()

      return () => {
        isClear = true
      }
    }
  }, [address])

  return addressGeocode
}
