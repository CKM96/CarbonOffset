import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import ProjectForm from '../../components/ProjectForm';

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
      <ProjectForm
        onSubmit={onSubmit}
        name={name as string}
        setName={setName}
        description={description as string}
        setDescription={setDescription}
      />
    </>
  );
}

export default EditProject;
