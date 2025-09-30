import { BaseGraphqlApi } from "@shared/api/base/base-graphql.api";
import { GraphQLClient } from "@helpers/api/graphql/graphql.client";
import { envHelper } from "@helpers/env/env.helper";
import { IProposal } from "@shared/contracts/governance/governance.contract";

export class GovernanceApi extends BaseGraphqlApi {
  constructor(graphqlClient: GraphQLClient) {
    super(graphqlClient);
  }

  protected get defaultHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${envHelper.getGovernanceApiKey()}`,
    };
  }

  async getAllProposals(): Promise<IProposal[]> {
    const response = await this.query<{ proposals: IProposal[] }>({
      operationName: "getProposals",
      query: `query getProposals {
  proposals(first: 1000, orderBy: startBlock, orderDirection: desc) {
    ...ProposalFields
    __typename
  }
}

fragment ProposalFields on Proposal {
  proposalId
  description
  proposer {
    id
    __typename
  }
  proposalCreated {
    timestamp
    __typename
  }
  proposalQueued {
    eta
    __typename
  }
  proposalExecuted {
    transaction {
      id
      timestamp
      __typename
    }
    __typename
  }
  votecast {
    id
    support {
      weight
      __typename
    }
    receipt {
      id
      voter {
        id
        __typename
      }
      weight
      support {
        id
        support
        __typename
      }
      __typename
    }
    __typename
  }
  startBlock
  endBlock
  queued
  canceled
  executed
  __typename
}`,
    });
    return response.data.proposals;
  }
}
