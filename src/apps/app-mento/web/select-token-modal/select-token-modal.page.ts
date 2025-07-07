import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { Token } from "@constants/token.constants";
import { BasePage } from "@shared/web/base/base.page";

export class SelectTokenModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  async getAllValidTokenNames(): Promise<string[]> {
    const allTokens = await this.ef.all.dataTestId("validToken").findElements();
    return Promise.all(allTokens.map(token => token.textContent()));
  }

  async getAllInvalidTokenNames(): Promise<string[]> {
    const allTokens = await this.ef.all
      .dataTestId("invalidToken")
      .findElements();
    return Promise.all(allTokens.map(token => token.textContent()));
  }

  get tokens(): ITokenDropdownOptions {
    return {
      [Token.CELO]: new Button(this.ef.dataTestId("tokenOption_CELO")),
      [Token.cEUR]: new Button(this.ef.dataTestId("tokenOption_cEUR")),
      [Token.cUSD]: new Button(this.ef.dataTestId("tokenOption_cUSD")),
      [Token.cREAL]: new Button(this.ef.dataTestId("tokenOption_cREAL")),
      [Token.cCOP]: new Button(this.ef.dataTestId("tokenOption_cCOP")),
      [Token.USDC]: new Button(this.ef.dataTestId("tokenOption_USDC")),
      [Token.USDT]: new Button(this.ef.dataTestId("tokenOption_USDT")),
      [Token.axlUSDC]: new Button(this.ef.dataTestId("tokenOption_axlUSDC")),
      [Token.axlEUROC]: new Button(this.ef.dataTestId("tokenOption_axlEUROC")),
      [Token.eXOF]: new Button(this.ef.dataTestId("tokenOption_eXOF")),
      [Token.cKES]: new Button(this.ef.dataTestId("tokenOption_cKES")),
      [Token.PUSO]: new Button(this.ef.dataTestId("tokenOption_PUSO")),
      [Token.cGHS]: new Button(this.ef.dataTestId("tokenOption_cGHS")),
      [Token.cGBP]: new Button(this.ef.dataTestId("tokenOption_cGBP")),
      [Token.cZAR]: new Button(this.ef.dataTestId("tokenOption_cZAR")),
      [Token.cCAD]: new Button(this.ef.dataTestId("tokenOption_cCAD")),
      [Token.cAUD]: new Button(this.ef.dataTestId("tokenOption_cAUD")),
      [Token.cCHF]: new Button(this.ef.dataTestId("tokenOption_cCHF")),
      [Token.cNGN]: new Button(this.ef.dataTestId("tokenOption_cNGN")),
      [Token.cJPY]: new Button(this.ef.dataTestId("tokenOption_cJPY")),
    };
  }

  title = new Label(this.ef.pw.text("Select asset to", { exact: false }));

  staticElements = [this.title];
}

export interface ITokenDropdownOptions extends Record<string, Button> {
  [Token.CELO]: Button;
  [Token.cEUR]: Button;
  [Token.cUSD]: Button;
  [Token.cREAL]: Button;
  [Token.cKES]: Button;
  [Token.cCOP]: Button;
  [Token.axlUSDC]: Button;
  [Token.axlEUROC]: Button;
  [Token.eXOF]: Button;
  [Token.USDT]: Button;
  [Token.USDC]: Button;
  [Token.PUSO]: Button;
  [Token.cGHS]: Button;
  [Token.cGBP]: Button;
  [Token.cZAR]: Button;
  [Token.cCAD]: Button;
  [Token.cAUD]: Button;
}
