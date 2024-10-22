export const magicStrings = {
  url: {
    web: {
      prod: {
        base: "https://app.mento.org/",
      },
    },
    api: {
      prod: {
        base: "",
      },
    },
  },
  path: {
    root: process.cwd(),
    get artifacts() {
      return `${this.root}/artifacts`;
    },
    get screenshots() {
      return `${this.root}/artifacts/screenshots`;
    },
    get allSpecs() {
      return `${this.root}/specs`;
    },
    get apiSpecs() {
      return `${this.root}/specs/api`;
    },
    get webSpecs() {
      return `${this.root}/specs/web`;
    },
  },
};
