import { fireEvent, render } from '@testing-library/react';
import CreateProject from '../pages/create-project';
import fetchMock from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';

jest.mock('next/router', () => require('next-router-mock'));

afterEach(jest.clearAllMocks);

describe('CreateProject', () => {
  it('matches snapshot', async () => {
    const { container, findByText } = render(<CreateProject />);

    await findByText('Create Offsetting Project');

    expect(container).toMatchSnapshot();
  });

  it('creates a new project', async () => {
    fetchMock.mockOnce('Created', { status: 201 });

    const { getByLabelText, getByText } = render(<CreateProject />);
    
    fireEvent.change(getByLabelText('Name'), {
      target: { value: 'Project name' },
    });
    fireEvent.change(getByLabelText('Description (optional)'), {
      target: { value: 'Project description' },
    });

    await act(async () => {fireEvent.click(getByText('Submit'))});

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'http://localhost:3001/projects',
    );
    expect(fetchMock.mock.calls[0][1]?.method).toEqual('post');
    expect(fetchMock.mock.calls[0][1]?.body).toEqual(
      JSON.stringify({
        name: 'Project name',
        description: 'Project description',
      }),
    );
  });
});
