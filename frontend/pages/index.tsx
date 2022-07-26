import Link from 'next/link';
import { Project } from '../types';
import styled from 'styled-components';
import useSWR from 'swr';
import cookie from 'cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

const Page = styled.div`
  max-width: 800px;
`;

const Project = styled.div`
  border-style: solid;
  padding: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

function Home() {
  const [accountId, setAccountId] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    const token = cookie.parse(document.cookie)?.accessToken;
    if (token) {
      setAccountId(jwtDecode<string>(token).sub);
    }
  }, []);

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

  const logout = () => {
    document.cookie = 'accessToken=;Max-Age=0';
  };

  return (
    <Page>
      <h1>Carbon Offsetting Projects</h1>
      <ButtonWrapper>
        <Link href="create-project">
          <button>Create new project</button>
        </Link>
        <Link href="login">
          <button onClick={logout}>Logout</button>
        </Link>
      </ButtonWrapper>
      {data?.map((project) => (
        <Project key={project.id}>
          {project.accountId === accountId && (
            <Link
              href={{
                pathname: `edit-project/${project.id}`,
                query: {
                  originalName: project.name,
                  originalDescription: project.description,
                },
              }}
            >
              <button>Edit</button>
            </Link>
          )}
          <h3>{project.name}</h3>
          <div>{project.description}</div>
        </Project>
      ))}
    </Page>
  );
}

export default Home;
