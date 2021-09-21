import { createSelector } from 'reselect'
import { initialState } from './reducer'

/**
 * Direct selector to the loginForm state domain
 */

const selectLoginFormDomain = (state) => state.loginForm || initialState

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginForm
 */

const makeSelectLoginForm = () => createSelector(selectLoginFormDomain, (substate) => substate)

export default makeSelectLoginForm
export { selectLoginFormDomain }
