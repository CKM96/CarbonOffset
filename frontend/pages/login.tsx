import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import cookie from 'cookie';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  width: 300px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Error = styled.div`
  width: 300px;
  color: red;
`;

const ButtonWrapper = styled.div`
  width: 300px;
  display: flex;
  justify-content: end;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorCode, setErrorCode] = useState<number>();

  const router = useRouter();

  useEffect(() => {
    const token = cookie.parse(document.cookie)?.accessToken;
    if (token) {
      router.push('/home');
    }
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch(
      `http://localhost:3001/auth/${isRegistering ? 'register' : 'login'}`,
      {
        method: 'post',
        headers: {
          Origin: 'localhost:3000',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );
    if (res.ok) {
      const body = await res.json();
      document.cookie = `accessToken=${body.accessToken};Max-Age=${3600}`;
      router.push('/home');
    } else {
      setErrorCode(res.status);
    }
  };

  const errorMessage = () => {
    switch (errorCode) {
      case 401:
        return 'Incorrect email or password.';
      case 409:
        return 'Email already registered.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <>
      <h1>Login</h1>
      <Form onSubmit={(event) => onSubmit(event)}>
        <Label>
          Email
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Label>
        <Label>
          Password
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Label>
        {errorCode && (
          <Error>{errorCode && <Error>{errorMessage()}</Error>}</Error>
        )}
        <ButtonWrapper>
          <input
            onClick={() => setIsRegistering(false)}
            type="submit"
            value="Login"
          />
          <input
            onClick={() => setIsRegistering(true)}
            type="submit"
            value="Register"
          />
        </ButtonWrapper>
      </Form>
    </>
  );
}

export default Login;
