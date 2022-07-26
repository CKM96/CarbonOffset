import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import ProjectForm from '../components/ProjectForm';

function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const router = useRouter();

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
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: 'localhost:3000',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      <h1>Create Offsetting Project</h1>
      <ProjectForm
        onSubmit={onSubmit}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
      />
    </>
  );
}

export default CreateProject;
