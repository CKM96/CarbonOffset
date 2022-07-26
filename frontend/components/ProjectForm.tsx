import { FormEvent } from 'react';
import styled from 'styled-components';

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

type ProjectFormProps = {
  onSubmit: (event: FormEvent) => void;
  name?: string;
  setName: (name: string) => void;
  description?: string;
  setDescription: (description: string) => void;
};

function ProjectForm(props: ProjectFormProps) {
  const { onSubmit, name, setName, description, setDescription } = props;
  return (
    <Form onSubmit={onSubmit}>
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
  );
}

export default ProjectForm;
