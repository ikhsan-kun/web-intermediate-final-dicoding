import HomePage from '../pages/home/home-page';
import StoryPage from '../pages/addStory/addStory-page';
import StoryDetailPage from '../pages/detailStory/detailStory-page'; 
import LoginPage from '../pages/login/login-page';
import RegisterView from '../pages/register/register-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import BookmarkPage from '../pages/bookmark/bookmark-page'; 

const routes = {
  '/':()=> checkAuthenticatedRoute(new HomePage()),
  '/about':()=> checkAuthenticatedRoute(new StoryPage()),
  '/story/:id': ()=> checkAuthenticatedRoute(new StoryDetailPage()),
  '/bookmark': ()=> checkAuthenticatedRoute(new BookmarkPage()), 
  '/login': ()=> checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register':()=> checkUnauthenticatedRouteOnly(new RegisterView()),
};

export default routes;