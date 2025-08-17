import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Home from 'routes/Home';
import New from 'routes/New';
import NotFoundPage from 'routes/NotFoundPage';
import Viewer from 'routes/Viewer';

const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />}></Route>
        <Route path="new" element={<New />}></Route>
        <Route path="g" element={<Viewer />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default Router;
