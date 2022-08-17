const createResourceRoutes = (resource:string) => ({
  root: `/${resource}`,
  create: `/${resource}/create`,
  update: `/${resource}/update/:id`,

});

export const routes = {
  root: '/',
  component: '/components',
  login: '/login',
  dashboard: '/dashboard',
};

export default routes;
