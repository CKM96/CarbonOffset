import Link from 'next/link';
import { Project } from '../types';
import styled from 'styled-components';
import useSWR from 'swr';
import cookie from 'cookie';
import { useRouter } from 'next/router';

const Project = styled.div`
  border-style: solid;
  padding: 8px;
  max-width: 500px;
`;

function Home() {
  const router = useRouter();

  const { data, error } = useSWR<Project[]>(
    'http://localhost:3001/projects',
    async (url: string) => {
      const token = cookie.parse(document.cookie)?.accessToken;
      const res = await fetch(url, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      });
      if (res.ok) {
        return await res.json();
      } else {
        router.push('/login');
      }
    },
  );

  if (error) {
    router.push('/login');
  }

  return (
    <>
      <h1>Carbon Offsetting Projects</h1>
      <>
        <Link href="create-project">
          <button>Create new project</button>
        </Link>
        {data?.map((project) => (
          <Project key={project.id}>
            <h3>{project.name}</h3>
            <div>{project.description}</div>
          </Project>
        ))}
      </>
    </>
  );
}

export default Home;