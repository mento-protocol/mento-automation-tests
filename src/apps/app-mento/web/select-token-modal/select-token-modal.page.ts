import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { Token } from "@constants/token.constants";
import { BasePage } from "@shared/web/base/base.page";

export class SelectTokenModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  async getAllValidTokenNames({
    shouldSort = false,
  }: { shouldSort?: boolean } = {}): Promise<string[]> {
    const allTokens = await this.ef.dataTestId("validToken").all();
    const tokenNames = await Promise.all(
      allTokens.map(token => token.textContent()),
    );
    return shouldSort ? tokenNames.sort() : tokenNames;
  }

  async getAllInvalidTokenNames({
    shouldSort = false,
  }: { shouldSort?: boolean } = {}): Promise<string[]> {
    const allTokens = await this.ef.dataTestId("invalidToken").all();
    const tokenNames = await Promise.all(
      allTokens.map(token => token.textContent()),
    );
    return shouldSort ? tokenNames.sort() : tokenNames;
  }

  anyToken = new Button(
    this.ef.dataTestId("tokenOption_", { exact: false }).first(),
  );

  get tokens(): ITokenDropdownOptions {
    return {
      [Token.CELO]: new Button(
        this.ef.dataTestId("tokenOption_CELO", { exact: false }),
      ),
      [Token.cEUR]: new Button(
        this.ef.dataTestId("tokenOption_cEUR", { exact: false }),
      ),
      [Token.cUSD]: new Button(
        this.ef.dataTestId("tokenOption_cUSD", { exact: false }),
      ),
      [Token.cREAL]: new Button(
        this.ef.dataTestId("tokenOption_cREAL", { exact: false }),
      ),
      [Token.cCOP]: new Button(
        this.ef.dataTestId("tokenOption_cCOP", { exact: false }),
      ),
      [Token.USDC]: new Button(
        this.ef.dataTestId("tokenOption_USDC", { exact: false }),
      ),
      [Token.USDT]: new Button(
        this.ef.dataTestId("tokenOption_USDT", { exact: false }),
      ),
      [Token["USD₮"]]: new Button(
        this.ef.dataTestId("tokenOption_USD₮", { exact: false }),
      ),
      [Token.axlUSDC]: new Button(
        this.ef.dataTestId("tokenOption_axlUSDC", { exact: false }),
      ),
      [Token.axlEUROC]: new Button(
        this.ef.dataTestId("tokenOption_axlEUROC", { exact: false }),
      ),
      [Token.eXOF]: new Button(
        this.ef.dataTestId("tokenOption_eXOF", { exact: false }),
      ),
      [Token.cKES]: new Button(
        this.ef.dataTestId("tokenOption_cKES", { exact: false }),
      ),
      [Token.PUSO]: new Button(
        this.ef.dataTestId("tokenOption_PUSO", { exact: false }),
      ),
      [Token.cGHS]: new Button(
        this.ef.dataTestId("tokenOption_cGHS", { exact: false }),
      ),
      [Token.cGBP]: new Button(
        this.ef.dataTestId("tokenOption_cGBP", { exact: false }),
      ),
      [Token.cZAR]: new Button(
        this.ef.dataTestId("tokenOption_cZAR", { exact: false }),
      ),
      [Token.cCAD]: new Button(
        this.ef.dataTestId("tokenOption_cCAD", { exact: false }),
      ),
      [Token.cAUD]: new Button(
        this.ef.dataTestId("tokenOption_cAUD", { exact: false }),
      ),
      [Token.cCHF]: new Button(
        this.ef.dataTestId("tokenOption_cCHF", { exact: false }),
      ),
      [Token.cNGN]: new Button(
        this.ef.dataTestId("tokenOption_cNGN", { exact: false }),
      ),
      [Token.cJPY]: new Button(
        this.ef.dataTestId("tokenOption_cJPY", { exact: false }),
      ),
    };
  }

  title = new Label(this.ef.text("Select asset to", { exact: false }));

  staticElements = [this.title, this.anyToken];
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
