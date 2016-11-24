import React, { PropTypes as T } from 'react';
import { Breadcrumb, Loader } from 'semantic-ui-react';

const PageBreadcrumb = ({ sections, isLoading }) => (
  <div>
    <Loader size="tiny" className="breadcrumb-loader" active={isLoading} inline={true} />
    <Breadcrumb icon="right angle" size="tiny" sections={sections} />
  </div>
);

PageBreadcrumb.propTypes = {
  isLoading: T.bool,
  sections: T.array.isRequired
};

PageBreadcrumb.defaultProps = {
  isLoading: false
};

export default PageBreadcrumb;
