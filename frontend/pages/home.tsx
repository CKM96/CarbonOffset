import { Project } from '../types';

type HomeProps = {
  projects: Project[];
};

function Home({ projects }: HomeProps) {
  return (
    <>
      <h1>Carbon Offsetting Projects</h1>
      <button>Create new project</button>
      {projects?.map((project) => (
        <>
          <h3>{project.name}</h3>
          <div>{project.description}</div>
        </>
      ))}
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3001/projects', {
    headers: new Headers({
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtYWlsQGVtYWlsd3Nhc3cxMjM0LmNvbSIsInN1YiI6IjE2MTIxODIzLWRlZDMtNDMzYy1iMzFjLTZmNWFiZmU1MThmMSIsImlhdCI6MTY1ODczOTc5NSwiZXhwIjoxNjU4NzQzMzk1fQ.WkPZgEW9z233jQC3nQ1t5CyZ4Li4gUmtX6SkzlnKUJ4',
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
