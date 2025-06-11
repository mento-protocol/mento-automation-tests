import { Token } from "@constants/token.constants";
import {
  Button,
  Dropdown,
  ElementsList,
  Input,
  Label,
} from "@page-elements/index";

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
