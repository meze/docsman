// @flow
import React from 'react';
import { Breadcrumb, Loader } from 'semantic-ui-react';

type PropsType = {
  isLoading: boolean,
  sections: Array<*>
}

const PageBreadcrumb = ({ sections, isLoading }: PropsType) => (
  <section>
    <Loader size="tiny" className="breadcrumb-loader" active={isLoading} inline={true} />
    <Breadcrumb icon="right angle" size="mini" sections={sections} />
  </section>
);

PageBreadcrumb.defaultProps = {
  isLoading: false
};

export default PageBreadcrumb;
