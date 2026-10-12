import awsConfig from '../config/awsExports';

type GraphQLError = { message: string };

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

const REQUEST_TIMEOUT_MS = 15000;

/**
 * Posts one GraphQL document to the AppSync endpoint.
 * Used by fetchAllCustomers. Throws a readable Error the screen can show.
 */
export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(awsConfig.aws_appsync_graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': awsConfig.aws_appsync_apiKey,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const body = (await response.json()) as GraphQLResponse<T>;
    if (body.errors && body.errors.length > 0) {
      throw new Error(body.errors[0].message);
    }
    if (!body.data) {
      throw new Error('The server did not return any data');
    }
    return body.data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The request timed out');
    }
    // fetch throws a TypeError when the radio / wifi is down.
    if (error instanceof TypeError) {
      throw new Error('Network request failed');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
