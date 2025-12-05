import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from '../pages/Home';
import Paths from '../pages/Paths';
import Tracks from '../pages/Tracks';
import TrackDetail from '../pages/TrackDetail';
import Resources from '../pages/Resources';
import ResourceDetail from '../pages/ResourceDetail';
import Me from '../pages/Me';
import Plan from '../pages/Plan';
import NotFound from '../pages/NotFound';

const RouterConfig = () => {
  return useRoutes([
    { path: '/', element: <Home /> },
    { path: '/paths', element: <Paths /> },
    { path: '/tracks', element: <Tracks /> },
    { path: '/tracks/:id', element: <TrackDetail /> },
    { path: '/resources', element: <Resources /> },
    { path: '/resources/:id', element: <ResourceDetail /> },
    { path: '/plan', element: <Plan /> },
    { path: '/me', element: <Me /> },
    { path: '*', element: <NotFound /> }
  ]);
};

export default RouterConfig;
