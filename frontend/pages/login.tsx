import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import styled from 'styled-components';

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

const ButtonWrapper = styled.div`
  width: 300px;
  display: flex;
  justify-content: end;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();

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
        <ButtonWrapper>
          <input type="submit" value="Login" />
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
