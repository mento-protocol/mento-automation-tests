# The Playwright tests framework demo

### .env file creates automatically on npm install. Check the following .env variable declarations:

- ENV - running on certain env. Can be passed: prod
- SPECS_TYPE running spec/s type. Can be passed: all | web | api
- SPEC_NAMES - running spec name/s. Can be passed name/s without extension by comma separated: sport,todos

### To run tests:

- npm test - runs test/s in the headed mode (can be shortened to "npm t")
- npm test:ui - runs test/s in the ui mode
- npm test:debug - runs test/s in the debug mode
- npm test:headless - runs test/s in the headless mode

### To run tests from CI:
Please, navigate to the Actions page and select the Manual Test Run workflow - there you can find the "event trigger" that can be configurable this way:

- branch
- Spec names of running tests - to pass test names by comma-separated
- Specs type to run exact type of tests - to select spec type from dropdown (all, web, api)
