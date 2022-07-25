import Link from 'next/link';
import { Project } from '../types';
import styled from 'styled-components';

type HomeProps = {
  projects: Project[];
};

const Project = styled.div`
  border-style: solid;
  padding: 8px;
  max-width: 500px;
`;

function Home({ projects }: HomeProps) {
  return (
    <>
      <h1>Carbon Offsetting Projects</h1>
      <Link href="create-project">
        <button>Create new project</button>
      </Link>
      {projects?.map((project) => (
        <Project key={project.id}>
          <h3>{project.name}</h3>
          <div>{project.description}</div>
        </Project>
      ))}
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3001/projects', {
    headers: new Headers({
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtYWlsQGVtYWlsd3Nhc3cxMjM0LmNvbSIsInN1YiI6IjE2MTIxODIzLWRlZDMtNDMzYy1iMzFjLTZmNWFiZmU1MThmMSIsImlhdCI6MTY1ODc1OTQ2NSwiZXhwIjoxNjU4NzYzMDY1fQ.nNl_j20bfluTwFwYRB5TAF3gBRB-Vi5l7h4r5VNzjQA',
    }),
  });
  const projects: Project[] = await res.json();

  return {
    props: {
      projects,
    },
  };
}

export default Home;
