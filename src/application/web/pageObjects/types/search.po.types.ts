import { ElementsList } from "../../pageElements/element-list.pe";
import { Input } from "../../pageElements/input";
import { Button } from "../../pageElements/button";

export interface ISearchPo {
  searchResultTitles: ElementsList<Button>;
  searchInput: Input;
  searchButton: Button;
}
