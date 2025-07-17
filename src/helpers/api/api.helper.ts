import { AssemblerHelper } from "@helpers/assembler/assembler.helper";
import { request } from "@playwright/test";

import { HttpClient } from "@shared/api/http/http-client";

export const apiHelper = new AssemblerHelper({
  httpClient: new HttpClient(request.newContext()),
}).api();
