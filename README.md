Frontend Dockerfile:

FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["ng", "serve", "--host", "0.0.0.0"]



Code For Testing
describe('Login Test', () => {
  it('logs in a user', () => {
    cy.visit('/login');
    cy.get('button').click();
    cy.url().should('include', '/dashboard');
  });
});
