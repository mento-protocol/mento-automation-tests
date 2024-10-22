import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { MainPoInterface } from "./types/main.po.types";
import { Button } from "../pageElements/button";
import { ElementsList } from "@web/pageElements/element-list.pe";

export class MainPo implements MainPoInterface {
  constructor(protected ef: ElementFinderHelper) {}

  connectButton = new Button(
    this.ef.pw.role("button", { name: "Connect", exact: true }),
  );
  walletTypeButtons = new ElementsList(
    Button,
    this.ef.all.className(
      "iekbcc0 ju367vj ju367v26 ju367v67 ju367v8m ju367v8y",
    ),
  );
}
