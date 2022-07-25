import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

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

function CreateProject() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch('http://localhost:3001/projects', {
      method: 'post',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtYWlsQGVtYWlsd3Nhc3cxMjM0LmNvbSIsInN1YiI6IjE2MTIxODIzLWRlZDMtNDMzYy1iMzFjLTZmNWFiZmU1MThmMSIsImlhdCI6MTY1ODc1OTQ2NSwiZXhwIjoxNjU4NzYzMDY1fQ.nNl_j20bfluTwFwYRB5TAF3gBRB-Vi5l7h4r5VNzjQA',
        Origin: 'localhost:3000',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description
      }),
    });
    if (res.ok) {
      router.push('/home');
    }
  };

  return (
    <>
      <h1>Create Offsetting Project</h1>
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

export default CreateProject;
