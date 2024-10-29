# Mento Automation Tests

## Summary

### Test automation framework repo to execute described tests against mento-web and other possible projects

### Here you can find more detailed overview of [test automation](https://www.notion.so/mentolabs/Test-Automation-12da2148cc5c8010bae9cf8150e5c13f)

## Pre-requisites

- [node.js](https://nodejs.org/en) >= 18.20.0
- [npm](https://nodejs.org/en) >= 10.5.0

## Pre-conditions

1. Execute `npm install`
2. Paste a seed phrase into the `SEED_PHRASE` variable (can be taken from [CI](https://github.com/mento-protocol/mento-automation-tests/settings/secrets/actions))

## Environment Variables

#### .env file creates automatically as a "postinstall" on `npm install` command execution

| Variable            | Example           | Description                                                                                                                  |
| ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| \*ENV               | `prod`            | required env, default `prod`                                                                                                 |
| \*SPECS_TYPE        | `web`             | required specs type to run. Can be: `all` or `web` or `api`                                                                  |
| SPEC_NAMES          | `wallet,slippage` | specs names separated by comma which will be executed locally, if no or disabled will execute all specs, disabled by default |
| TEST_RETRY          | `1`               | retries N times if test fails, disabled by default                                                                           |
| \*SEED_PHRASE       | `'seed phrase'`   | required seed phrase for connection of metamask wallet                                                                       |
| TEST_RUNNER_TIMEOUT | `120_000`         | custom test runner timeout, disabled by default                                                                              |
| LOG_LEVEL           | `DEBUG`           | desired log level, disabled by default. Can be: ALL, TRACE, INFO, DEBUG                                                      |

## Local test/s execution by mods:

- _**headed**_ - with opening browser (command can be shortened to `npm t`)

`npm run test`

- _**ui**_ - with opening browser in specified app with all devtools, traces, and other playwright features

`npm run test:ui`

- _**debug**_ - with opening browser and specified debug app to pause/resume test

`npm run test:debug`

- _**headless**_ - without opening browser and other playwright features

`npm run test:headless`

## CI test/s execution by the "Manual Test Run" trigger:

1. Navigate to the [CI](https://github.com/mento-protocol/mento-automation-tests/actions)
2. Select the "Manual Test Run" workflow
3. Click on the "Run workflow" drop-down
4. Select a branch, write a spec name/s, and select specs type
