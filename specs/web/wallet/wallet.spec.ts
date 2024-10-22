import { expect, testFixture } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { suiteEasier } from "@helpers/suiteEasier/suite.helper";

// testFixture.describe("Connect available wallets", () => {
//   testFixture.beforeAll(async ({ web, wallet }) => {
//     await web.main.setupPlatformPreconditions(wallet);
//   });
//   testFixture("The Metamask wallet can be connected", async ({ web }) => {
//     expect(await web.main.isWalletConnected());
//   });
// });

// make a condition
// test.info().skip({})

suiteEasier({
  name: "Connect available wallets",
  tests: [
    {
      testName: "Metamask wallet can be connected",
      test: async ({ web, wallet }) => {
        await web.main.setupPlatformPreconditions(wallet);
        expect(await web.main.isWalletConnected());
      },
    },
  ],
});

// suite({
//   name: "Connect available wallets",
//   beforeAll: async ({ web }) => {
//     console.info("beforeAll");
//   },
//   beforeEach: async ({ web }) => {
//     console.info("beforeEach");
//   },
//   afterEach: async ({ web }) => {
//     console.info("afterEach");
//   },
//   afterAll: async ({ web }) => {
//     console.info("afterAll");
//   },
//   tests: [
//     {
//       testName: "First",
//       test: async ({ web }) => {
//         console.info("test");
//       },
//     },
//     {
//       testName: "Second",
//       test: async ({ web }) => {
//         console.info("test");
//       },
//     },
//   ],
// });
