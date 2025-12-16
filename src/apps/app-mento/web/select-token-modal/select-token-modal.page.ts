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
      [Token.EURm]: new Button(
        this.ef.dataTestId("tokenOption_EURm", { exact: false }),
      ),
      [Token.USDm]: new Button(
        this.ef.dataTestId("tokenOption_USDm", { exact: false }),
      ),
      [Token.BRLm]: new Button(
        this.ef.dataTestId("tokenOption_BRLm", { exact: false }),
      ),
      [Token.COPm]: new Button(
        this.ef.dataTestId("tokenOption_COPm", { exact: false }),
      ),
      [Token.USDC]: new Button(
        this.ef.dataTestId("tokenOption_USDC", { exact: false }),
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
      [Token.XOFm]: new Button(
        this.ef.dataTestId("tokenOption_XOFm", { exact: false }),
      ),
      [Token.KESm]: new Button(
        this.ef.dataTestId("tokenOption_KESm", { exact: false }),
      ),
      [Token.PHPm]: new Button(
        this.ef.dataTestId("tokenOption_PHPm", { exact: false }),
      ),
      [Token.GHSm]: new Button(
        this.ef.dataTestId("tokenOption_GHSm", { exact: false }),
      ),
      [Token.GBPm]: new Button(
        this.ef.dataTestId("tokenOption_GBPm", { exact: false }),
      ),
      [Token.ZARm]: new Button(
        this.ef.dataTestId("tokenOption_ZARm", { exact: false }),
      ),
      [Token.CADm]: new Button(
        this.ef.dataTestId("tokenOption_CADm", { exact: false }),
      ),
      [Token.AUDm]: new Button(
        this.ef.dataTestId("tokenOption_AUDm", { exact: false }),
      ),
      [Token.CHFm]: new Button(
        this.ef.dataTestId("tokenOption_CHFm", { exact: false }),
      ),
      [Token.NGNm]: new Button(
        this.ef.dataTestId("tokenOption_NGNm", { exact: false }),
      ),
      [Token.JPYm]: new Button(
        this.ef.dataTestId("tokenOption_JPYm", { exact: false }),
      ),
    };
  }

  title = new Label(this.ef.text("Select asset to", { exact: false }));

  staticElements = [this.title, this.anyToken];
}

export interface ITokenDropdownOptions extends Record<string, Button> {
  [Token.CELO]: Button;
  [Token.EURm]: Button;
  [Token.USDm]: Button;
  [Token.BRLm]: Button;
  [Token.KESm]: Button;
  [Token.COPm]: Button;
  [Token.axlUSDC]: Button;
  [Token.axlEUROC]: Button;
  [Token.XOFm]: Button;
  [Token.USDC]: Button;
  [Token.PHPm]: Button;
  [Token.GHSm]: Button;
  [Token.GBPm]: Button;
  [Token.ZARm]: Button;
  [Token.CADm]: Button;
  [Token.AUDm]: Button;
  [Token.CHFm]: Button;
  [Token.NGNm]: Button;
  [Token.JPYm]: Button;
}
