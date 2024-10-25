# Mento automation tests framework

#### .env file creates automatically on npm install. Check the following .env variable declarations:

- ENV - running on certain env. Can be passed: prod
- SPECS_TYPE running spec/s type. Can be passed: all | web | api
- SPEC_NAMES - running spec name/s. Can be passed name/s without extension by comma separated: sport,todos

## To execute test/s in different mods:

- ##### _headed_ (can be shortened to "npm t")

```
 npm run test
```

- ##### _ui_

```
 npm run test:ui
```

- ##### _debug_

```
 npm run test:debug
```

- ##### _headless_

```
 npm run test:headless
```

## To run tests from CI:

Please, navigate to the Actions page and select the Manual Test Run workflow - there you can find the "event trigger" that can be configurable this way:

- branch
- Spec names of running tests - to pass test names by comma-separated
- Specs type to run exact type of tests - to select spec type from dropdown (all, web, api)
