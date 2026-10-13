import { gql } from 'graphql-request';
import type { RemoteCustomer } from '../types';
import { graphqlRequest } from './graphqlClient';

// The document graphql-request sends to AppSync.
export const LIST_CUSTOMERS_QUERY = gql`
  query ListZellerCustomers($limit: Int, $nextToken: String) {
    listZellerCustomers(limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;

type ListResponse = {
  listZellerCustomers: {
    items: (RemoteCustomer | null)[] | null;
    nextToken: string | null;
  } | null;
};


/**
 * Downloads every page of listZellerCustomers.
 * The caller writes the result into Realm. The list UI does not use this directly.
 */
export async function fetchAllCustomers(): Promise<RemoteCustomer[]> {
  const list: RemoteCustomer[] = [];
  let nextToken: string | undefined;

  const data = await graphqlRequest<ListResponse>(LIST_CUSTOMERS_QUERY, {
    limit: 100,
    nextToken,
  });

  const page = data.listZellerCustomers;
  const items = page?.items ?? [];
  for (const item of items) {
    if (item && item.id) {
      list.push(item);
    }
  }
  return list;
}
