import {
  ClientError,
  GraphQLClient,
  type RequestDocument,
} from 'graphql-request';
import awsConfig from '../config/awsExports';

const REQUEST_TIMEOUT_MS = 15000;

// One GraphQL client for the local mock server. It does not check an API key.
const client = new GraphQLClient(awsConfig.aws_appsync_graphqlEndpoint, {
  // Look up fetch on each call so tests can replace it, and so the device uses its own.
  fetch: (input, init) => fetch(input, init),
});

/**
 * Runs a GraphQL query against the mock server and returns the `data` object.
 * Used by loadCustomersFromApi for the first list and for pull-to-refresh.
 */
export async function graphqlRequest<T>(
  query: RequestDocument,
  variables?: Record<string, unknown>,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const data = await client.request<T>({
      document: query,
      variables,
      signal: controller.signal,
    });
    if (__DEV__) {
      console.log('GraphQL API response', JSON.stringify(data, null, 2));
    }
    return data;
  } catch (error) {
    if (error instanceof ClientError) {
      if (__DEV__) {
        console.log(
          'GraphQL API response',
          JSON.stringify(error.response, null, 2),
        );
      }
      const msg = error.response.errors?.[0]?.message;
      throw new Error(msg ?? error.message);
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The request timed out');
    }
    if (error instanceof TypeError) {
      throw new Error('Network request failed');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
