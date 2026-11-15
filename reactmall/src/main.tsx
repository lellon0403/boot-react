import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import router from './router/root';

// 메인에서는 띄우기만 하고 라우터에서 각 화면별로 해주는걸 구현하는듯?

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);
