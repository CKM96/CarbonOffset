# CarbonOffset

A website that allows users to view, create and edit carbon offsetting projects. Users can create an account by providing an email and password. Projects consist of a name and an optional description.

## Setup

### Database
From project root, run:
```
$ docker-compose up
```
### Backend
From `backend`, run:
```bash
$ yarn
# then
$ yarn run start
```

### Frontend
From `frontend`, run:
```bash
$ yarn
# then
$ yarn run build
# then
$ yarn run start
# or, after yarn, just run:
$ yarn run dev
```

### Tests
From either `backend` or `frontend`, run:
```
yarn run test
```

## Potential improvements

### Functionality
- Add more fields to project, like contact details, images or carbon offset statistics
- Allow users to delete projects or accounts
- Allow for rich text project descriptions
- Add filtering/sorting options to home page

### Security
- Add email verification user flow upon registration
- Add password recovery flow
- Add a JWT blacklist to the backend to prevent logged-out JWTs from being used any further
- Add a middleware API layer to facilitate HTTP-only cookies and/or proper session control
- Use environment variables for frontend URL and port number
- Validate route query for the edit project page such that manually entered URLs can't allow one user to edit another's project, or nonexistent projects.

### Performance
- Add indexes to database tables for faster lookups
- Utilise async encryption methods in the backend, so as not to block other requests to the endpoint while encryption is occurring

### UI/UX
- UI in general could do with some better styling and layout
- Add password strength indicator when registering new user, as well as requiring passwords to be entered twice
- Make project description form input multiple lines to better display long pieces of text
- Add cancel buttons to create/edit project pages rather than having to rely on using the browser back button
- Check whether email to register account to already has an account associated with it in real time, rather than waiting for the user to enter a password and then submitting
- Store and check emails in a case-insensitive way
- Consider enforcing unique project names to minimise confusion
- Add spinners to display while loading
- Better handle and communicate errors, such that the app doesn't just log out whenever an error occurs

### Testing
- Add more tests in the frontend for things like routing. error cases and cookies
- Implement Cypress or a similar tool to facilitate e2e testing

### Development
- Implement Flyway or similar tool to better facilitate future database configuration changes
- Implement husky or similar tool for pre-commit checks
- Set up Docker containers for the frontend and backend to facilitate easier deployment
- Store all environment variables across the monorepo in one .env file at the project root to help keep things consistent across services
