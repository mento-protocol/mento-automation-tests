import { IBaseServiceArgs } from "@services/index";
import { NetworkDetailsModalPo } from "@page-objects/index";

export interface INetworkDetailsModalService {
  switchNetworkByName: (name: Network) => Promise<void>;
  getCurrentNetwork: () => Promise<string>;
}

export interface INetworkDetailsModalServiceArgs extends IBaseServiceArgs {
  page: NetworkDetailsModalPo;
}

export enum Network {
  Celo = "Celo",
  Alfajores = "Alfajores",
  Baklava = "Baklava",
}