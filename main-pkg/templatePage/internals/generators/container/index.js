/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists')

module.exports = {
  description: 'Add a feature component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'LoginForm',
      validate: (value) => {
        if (/.+/.test(value)) {
          return componentExists(value) ? 'A component or feature with this name already exists' : true
        }

        return 'The name is required'
      },
    },
    {
      type: 'confirm',
      name: 'memo',
      default: false,
      message: 'Do you want to wrap your component in React.memo?',
    },
    // {
    //   type: 'confirm',
    //   name: 'wantHeaders',
    //   default: false,
    //   message: 'Do you want headers?',
    // },
    {
      type: 'confirm',
      name: 'wantActionsAndReducer',
      default: true,
      message: 'Do you want an actions/constants/selectors/reducer tuple for this feature?',
    },
    // {
    //   type: 'confirm',
    //   name: 'wantSaga',
    //   default: true,
    //   message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
    // },
    // {
    //   type: 'confirm',
    //   name: 'wantMessages',
    //   default: true,
    //   message: 'Do you want i18n messages (i.e. will this component use text)?',
    // },
    // {
    //   type: 'confirm',
    //   name: 'wantLoadable',
    //   default: true,
    //   message: 'Do you want to load resources asynchronously?',
    // },
  ],
  actions: (data) => {
    // Generate index.js and index.test.js
    const actions = [
      {
        type: 'add',
        path: '../../src/features/{{properCase name}}/{{properCase name}}.tsx',
        templateFile: './container/index.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../src/features/{{properCase name}}/__tests__/{{properCase name}}.test.tsx',
        templateFile: './container/test.js.hbs',
        abortOnFail: true,
      },
    ]

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/messages.ts',
        templateFile: './container/messages.js.hbs',
        abortOnFail: true,
      })
    }

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/actions.ts',
        templateFile: './container/actions.js.hbs',
        abortOnFail: true,
      })
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/__tests__/actions.test.ts',
        templateFile: './container/actions.test.js.hbs',
        abortOnFail: true,
      })

      // Constants
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/constants.ts',
        templateFile: './container/constants.js.hbs',
        abortOnFail: true,
      })

      // Selectors
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/selectors.ts',
        templateFile: './container/selectors.js.hbs',
        abortOnFail: true,
      })
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/__tests__/selectors.test.ts',
        templateFile: './container/selectors.test.js.hbs',
        abortOnFail: true,
      })

      // Reducer
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/reducer.ts',
        templateFile: './container/reducer.js.hbs',
        abortOnFail: true,
      })
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/__tests__/reducer.test.ts',
        templateFile: './container/reducer.test.js.hbs',
        abortOnFail: true,
      })
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/saga.ts',
        templateFile: './container/saga.js.hbs',
        abortOnFail: true,
      })
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/__tests__/saga.test.ts',
        templateFile: './container/saga.test.js.hbs',
        abortOnFail: true,
      })
    }

    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: '../../src/features/{{properCase name}}/Loadable.ts',
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      })
    }

    actions.push({
      type: 'prettify',
      path: '/features/',
    })

    return actions
  },
}
