import { act, fireEvent, render } from '@testing-library/react';
import Login from '../pages/login';
import fetchMock from 'jest-fetch-mock';

jest.mock('next/router', () => require('next-router-mock'));

beforeEach(fetchMock.mockReset);

afterEach(() => {
  document.cookie = 'accessToken=;Max-Age=0';
});

describe('Login', () => {
  it('matches snapshot', async () => {
    const { container, findByText } = render(<Login />);

    await findByText('Login/Register');

    expect(container).toMatchSnapshot();
  });

  it('logs in existing users',async () => {
    fetchMock.mockOnce(JSON.stringify({ accessToken: 'accessToken' }));
    const { getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'email@email.com' },
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password' },
    });

    await act(async() => {
      fireEvent.click(getByText('Login'));
    });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'http://localhost:3001/auth/login',
    );
    expect(fetchMock.mock.calls[0][1]?.body).toEqual(
      JSON.stringify({
        email: 'email@email.com',
        password: 'password',
      }),
    );
  });

  it('registers new user', async () => {
    fetchMock.mockOnce(JSON.stringify({ accessToken: 'accessToken' }));
    const { getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'email@email.com' },
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(getByText('Register as new user'));

    await act(async () => {
      fireEvent.click(getByText('Register'));
    });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'http://localhost:3001/auth/register',
    );
    expect(fetchMock.mock.calls[0][1]?.body).toEqual(
      JSON.stringify({
        email: 'email@email.com',
        password: 'password',
      }),
    );
  });

  it('shows an error if attempting to log in with incorrect credentials', async () => {
    fetchMock.mockResponseOnce('Incorrect credentials', {
      status: 401,
    });
    const { findByText, getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'email@email.com' },
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password' },
    });

    fireEvent.click(getByText('Login'));

    expect(await findByText('Incorrect email or password.'));
  });

  it('shows an error if attempting to register with a used email', async () => {
    fetchMock.mockResponseOnce('Email already registered', {
      status: 409,
    });
    const { findByText, getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'email@email.com' },
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(getByText('Register as new user'));

    fireEvent.click(getByText('Register'));

    expect(await findByText('Email already registered.'));
  });

  it('shows a generic error', async () => {
    fetchMock.mockResponseOnce('Internal server error', {
      status: 500,
    });
    const { findByText, getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText('Email'), {
      target: { value: 'email@email.com' },
    });
    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'password' },
    });

    fireEvent.click(getByText('Login'));

    expect(await findByText('An error occurred. Please try again.'));});
});
