import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const PagePlaceholder = ({ pageName }) => {
  return (
    <div className="page-container">
      <h2>{pageName}</h2>
      <p>This page is under development. It will be implemented with full functionality.</p>
      <LoadingSpinner />
    </div>
  );
};

export default PagePlaceholder;
