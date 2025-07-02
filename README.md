# Mento Automation Tests

## Summary

### Test automation framework repo to execute described tests against mento-web and other possible projects

### Here you can find more detailed overview of [test automation](https://www.notion.so/mentolabs/Test-Automation-12da2148cc5c8010bae9cf8150e5c13f)

## Pre-requisites

- [node.js](https://nodejs.org/en) >= 20.11.1
- [npm](https://nodejs.org/en) >= 10.5.0

## Pre-conditions

1. Execute `npm install`.
2. Execute `npm run install-playwright`.
3. Fill the `SEED_PHRASE`, and `WALLET_PASSWORD` variables.
4. Specify the `IS_MAINNET` variable (ensure you re-built synpress cache when changing a chain by this flag!).
5. Execute `npm run build-synpress-cache`.

## Environment Variables

#### .env file creates automatically via "postinstall" on `npm install` command execution

| Variable                   | Example                       | Description                                                                                                                          |
| -------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| \*ENV                      | `prod`                        | required env, default `prod`                                                                                                         |
| \*SPECS_TYPE               | `web`                         | required specs type to run. Can be: `all` or `web` or `api`                                                                          |
| SPECS_REGEX                | `connect-wallet,wallet-modal` | specs names or tags separated by comma which will be executed locally, if no or disabled will execute all specs, disabled by default |
| TEST_RETRY                 | `1`                           | retries N times if test fails, disabled by default                                                                                   |
| \*SEED_PHRASE              | `'seed phrase'`               | required seed phrase for connection of metamask wallet                                                                               |
| \*WALLET_PASSWORD          | `'password'`                  | required password for connection of metamask wallet                                                                                  |
| \*IS_MAINNET               | `'true'`                      | required flag to specify chain for test running                                                                                      |
| TEST_RUN_TIMEOUT           | `120_000`                     | custom test run timeout, disabled by default                                                                                         |
| TEST_TIMEOUT               | `120_000`                     | custom test timeout, disabled by default                                                                                             |
| LOG_LEVEL                  | `DEBUG`                       | desired log level, disabled by default. Can be: ALL, TRACE, INFO, DEBUG                                                              |
| TESTOMAT_REPORT_GENERATION | `false`                       | desired option to generate testomat test run report or not. Can be: true or false                                                    |
| TESTOMATIO_TITLE           | `your own title`              | desired testomat test run report title to run locally.                                                                               |
| \*TESTOMAT_API_KEY         | `api key`                     | testomat api key to run locally. Can be taken from GH actions secrets or lastPass note                                               |

## Local test/s execution by mods:

- _**headed**_ - with opening browser (command can be shortened to `npm t`)

`npm run test`

- _**ui**_ - with opening browser in specified app with all devtools, traces, and other playwright features

`npm run test:ui`

- _**debug**_ - with opening browser and specified debug app to pause/resume test

`npm run test:debug`

- _**headless**_ - without opening browser and other playwright features

`npm run test:headless`

## CI test/s execution by the "Specific Test Run" trigger:

1. Navigate to the [CI](https://github.com/mento-protocol/mento-automation-tests/actions)
2. Select the "Specific Test Run" workflow
3. Click on the "Run workflow" drop-down
4. Select a branch, write a spec name/s, and select specs type
