import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import WorkflowPage from '@/pages/WorkflowPage';
import CompetitorAnalysisPage from '@/pages/CompetitorAnalysisPage';
import CustomerAnalysisPage from '@/pages/CustomerAnalysisPage';
import LoyaltyObjectivesPage from '@/pages/LoyaltyObjectivesPage';
import LoyaltyMechanicsPage from '@/pages/LoyaltyMechanicsPage';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'workflow/:workflowId',
        element: <WorkflowPage />
      },
      {
        path: 'workflow/:workflowId/competitor-analysis',
        element: <CompetitorAnalysisPage />
      },
      {
        path: 'workflow/:workflowId/customer-analysis',
        element: <CustomerAnalysisPage />
      },
      {
        path: 'workflow/:workflowId/loyalty-objectives',
        element: <LoyaltyObjectivesPage />
      },
      {
        path: 'workflow/:workflowId/loyalty-mechanics',
        element: <LoyaltyMechanicsPage />
      }
    ]
  }
];

export const router = createBrowserRouter(routes);
