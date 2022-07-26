import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import cookie from 'cookie';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-bottom: 8px;
`;

const SubmitButton = styled.input`
  max-width: 300px;
`;

function EditProject() {
  const router = useRouter();
  const { id, originalName, originalDescription } = router.query;

  const [name, setName] = useState(originalName);
  const [description, setDescription] = useState(originalDescription);

  useEffect(() => {
    const token = cookie.parse(document.cookie)?.accessToken;
    if (!token) {
      router.push('/login');
    }
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = cookie.parse(document.cookie)?.accessToken;
    const res = await fetch('http://localhost:3001/projects', {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: 'localhost:3000',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name,
        description,
      }),
    });
    if (res.ok) {
      router.push('/');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <h1>Edit Offsetting Project</h1>
      <Form onSubmit={(event) => onSubmit(event)}>
        <Label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Label>
        <Label>
          Description (optional)
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Label>
        <SubmitButton type="submit" value="Submit" />
      </Form>
    </>
  );
}

export default EditProject;
