import { fetchAllCustomers, LIST_CUSTOMERS_QUERY } from '../src/api/fetchCustomers';

function page(ids: string[], nextToken: string | null) {
  return {
    ok: true,
    json: async () => ({
      data: {
        listZellerCustomers: {
          items: ids.map(id => ({
            id,
            name: `User ${id}`,
            email: `${id}@zeller.com`,
            role: 'Admin',
          })),
          nextToken,
        },
      },
    }),
  };
}

describe('fetchAllCustomers', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('asks AppSync for listZellerCustomers and follows nextToken', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(page(['1'], 'more'))
      .mockResolvedValueOnce(page(['2'], null));
    global.fetch = fetchMock as unknown as typeof fetch;

    const customers = await fetchAllCustomers();

    expect(customers.map(customer => customer.id)).toEqual(['1', '2']);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const firstCall = fetchMock.mock.calls[0];
    const body = JSON.parse(firstCall[1].body);
    expect(body.query).toContain('listZellerCustomers');
    expect(body.query).toBe(LIST_CUSTOMERS_QUERY);
    expect(firstCall[1].headers['x-api-key']).toBeTruthy();
  });

  it('surfaces the GraphQL error message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ errors: [{ message: 'Unauthorized' }] }),
    }) as unknown as typeof fetch;

    await expect(fetchAllCustomers()).rejects.toThrow('Unauthorized');
  });
});
