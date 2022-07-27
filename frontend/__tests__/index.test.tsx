import { render } from '@testing-library/react';
import Home from '../pages/index';
import fetchMock from 'jest-fetch-mock';

jest.mock('jwt-decode', () => () => ({ sub: 'accountId' }));

beforeAll(() => {
  document.cookie = `accessToken=accountId;Max-Age=3600`;
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
  fetchMock.mockIf('http://localhost:3001/projects', JSON.stringify(projects));
});

afterEach(jest.clearAllMocks);

describe('Home', () => {
  it('matches snapshot', async () => {
    const { container, findByText } = render(<Home />);

    await findByText('Project name');

    expect(container).toMatchSnapshot();
  });
});
