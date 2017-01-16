import * as React from 'react';
import { Breadcrumb, Loader } from 'semantic-ui-react';

export interface IPageBreadcrumbProps {
  sections: string[];
  isLoading: boolean;
}

const PageBreadcrumb: React.SFC<IPageBreadcrumbProps> = ({ sections, isLoading }: IPageBreadcrumbProps): JSX.Element => (
  <div>
    <Loader size="tiny" className="breadcrumb-loader" active={isLoading} inline={true} />
    <Breadcrumb icon="right angle" size="tiny" sections={sections} />
  </div>
);

PageBreadcrumb.defaultProps = {
  isLoading: false,
  sections: []
};

export default PageBreadcrumb;
