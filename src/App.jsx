import { lazy, Suspense } from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
// 组件
import Control from './components/Control';
import AuthRoute from './components/AuthRoute';
import Loading from './components/Loading';
// 页面 懒加载
const Index = lazy(() => import('./views/Index'));
const Shares = lazy(() => import('./views/Shares'));
const ShareDetails = lazy(() => import('./views/ShareDetails'));
const Community = lazy(() => import('./views/Community'));
const Login = lazy(() => import('./views/Login'));
const Search = lazy(() => import('./views/Search'));
const Oneself = lazy(() => import('./views/Oneself'));
const Past = lazy(() => import('./views/Past'));
const Expand = lazy(() => import('./views/Expand'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading/> }>
      <Control/>
      {/* 配置路由 */}
      <Route path="/" component={Index} exact />
      <Route path="/shares" component={Shares} />
      <Route path="/share_details/:id" component={ShareDetails} />
      <Route path="/login" component={Login} />
      <Route path="/search/:query" component={Search} />
      <Route path="/expand" component={Expand} />
      {/* 鉴权路由 */}
      <AuthRoute path="/community" component={Community}/>
      <AuthRoute path="/oneself" component={Oneself}/>
      <AuthRoute path="/past" component={Past}/>
      <Route exact path="/index" render={() => <Redirect to="/" />} /> 
      </Suspense>
    </BrowserRouter>
  );
}