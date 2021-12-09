import { FetchPatientPreferences } from '../__graphql/graphql'

type OmitTypeName<T> = Omit<T, '__typename'>

export type PatientPreferenceItem = OmitTypeName<FetchPatientPreferences.Node>
