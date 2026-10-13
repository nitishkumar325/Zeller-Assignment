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

// A guard so a stuck nextToken cannot spin forever.
const MAX_PAGES = 20;

/**
 * Downloads every page of listZellerCustomers.
 * The caller writes the result into Realm. The list UI does not use this directly.
 */
export async function fetchAllCustomers(): Promise<RemoteCustomer[]> {
  const collected: RemoteCustomer[] = [];
  let nextToken: string | undefined;


    const data = await graphqlRequest<ListResponse>(LIST_CUSTOMERS_QUERY, {
      limit: 100,
      nextToken,
    });

    const connection = data.listZellerCustomers;
    const items = connection?.items ?? [];
    for (const item of items) {
      if (item && item.id) {
        collected.push(item);
      }
    }
  return collected;
}
