import { act, render } from '@testing-library/react';
import Home from '../pages/index';
import fetchMock from 'jest-fetch-mock';
import { SWRConfig } from 'swr';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('jwt-decode', () => () => ({ sub: 'accountId' }));

beforeAll(() => {
  document.cookie = `accessToken=accountId;Max-Age=3600`;
});

afterEach(fetchMock.mockClear);

const projects = [
  {
    id: 'id',
    accountId: 'accountId',
    name: 'Project name',
    description: 'Project description',
  },
  {
    id: 'id2',
    accountId: 'accountId2',
    name: 'Second project name',
    description: 'Second project description',
  },
];

describe('Home', () => {
  it('matches snapshot', async () => {
    fetchMock.mockIf(
      'http://localhost:3001/projects',
      JSON.stringify(projects),
    );

    const { container, findByText } = render(
      // @note: This makes it so that we always refresh the cache
      <SWRConfig value={{ provider: () => new Map() }}>
        <Home />
      </SWRConfig>,
    );

    await findByText('Project name');

    expect(container).toMatchSnapshot();
  });

  it('logs the user out if an API error occurs', async () => {
    fetchMock.mockResponseOnce('Incorrect credentials', {
      status: 401,
    });

    await act(async () => {
      render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <Home />
        </SWRConfig>,
      );
    });

    expect(document.cookie).toEqual('');
  });
});
