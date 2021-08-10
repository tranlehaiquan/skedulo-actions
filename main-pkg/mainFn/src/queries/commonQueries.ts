export const fetchResources = `
  query getResources($filter: EQLQueryFilterResources) {
    resources(filter: $filter) {
      edges {
        node {
          UID
          Name
          MobilePhone
          PrimaryRegion {
            Timezone
          }
          JobAllocations {
            UID
            Name
            Status
          }
        }
      }
    }
  }
`
