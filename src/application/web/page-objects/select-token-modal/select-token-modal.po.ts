import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import {
  Button,
  Dropdown,
  ElementsList,
  Input,
  Label,
} from "@page-elements/index";
import { Token } from "@constants/token.constants";
import { BasePo, ITokenDropdownOptions } from "@page-objects/index";

export class SelectTokenModalPo extends BasePo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
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
