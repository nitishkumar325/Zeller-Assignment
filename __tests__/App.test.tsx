import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('realm', () => {
  class Realm {
    tables: Record<string, Array<Record<string, unknown>>>;
    listeners: Set<() => void>;

    static UpdateMode = { Modified: 'modified' };

    static open() {
      return Promise.resolve(new Realm());
    }

    constructor() {
      this.tables = { Customer: [], DeletedCustomer: [] };
      this.listeners = new Set();
    }

    objects(name: string) {
      const source = this.tables[name] ?? [];
      const view = source.slice() as Array<Record<string, unknown>> & {
        addListener: (fn: () => void) => void;
        removeListener: (fn: () => void) => void;
      };
      view.addListener = fn => {
        this.listeners.add(fn);
      };
      view.removeListener = fn => {
        this.listeners.delete(fn);
      };
      return view;
    }

    write(work: () => void) {
      work();
    }

    create(name: string, value: { id: string }) {
      const list = this.tables[name];
      const index = list.findIndex(item => item.id === value.id);
      if (index >= 0) {
        list[index] = { ...value };
      } else {
        list.push({ ...value });
      }
      this.listeners.forEach(listener => listener());
    }

    objectForPrimaryKey(name: string, id: string) {
      return this.tables[name].find(item => item.id === id) ?? null;
    }

    delete(row: { id: string }) {
      const list = this.tables.Customer;
      const index = list.findIndex(item => item.id === row.id);
      if (index >= 0) {
        list.splice(index, 1);
      }
    }
  }

  return { __esModule: true, default: Realm };
});

jest.mock('react-native-pager-view', () => {
  const ReactLib = require('react');
  const { View } = require('react-native');
  const Pager = ReactLib.forwardRef(
    (props: { children?: React.ReactNode }, ref: React.Ref<{ setPage: () => void }>) => {
      ReactLib.useImperativeHandle(ref, () => ({ setPage: () => {} }));
      return ReactLib.createElement(View, null, props.children);
    },
  );
  return { __esModule: true, default: Pager };
});

const customers = [
  {
    id: '1',
    name: 'Barbara Streider',
    email: 'barbara@zeller.com',
    role: 'Admin',
  },
];

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: {
        listZellerCustomers: { items: customers, nextToken: null },
      },
    }),
  }) as unknown as typeof fetch;
});

test('loads customers from the API into the list', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  const tree = JSON.stringify(renderer!.toJSON());
  expect(tree).toContain('Barbara Streider');
  expect(tree).toContain('Admin');
});
