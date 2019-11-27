import React from 'react';

import { CaretIcon } from 'renderer/components/caret-icon/CaretIcon';
import { NavLink } from 'renderer/components/nav-link/NavLink';

export const StepHeader: React.FC<{
  title?: string;
  backLink?: string;
}> = props => {
  return (
    <header className="mb-2">
      {props.backLink && (
        <NavLink to={props.backLink} className="is-inline-flex is-vcenter">
          <CaretIcon dir="left" className="mr-0" /> Back
        </NavLink>
      )}
      {props.title && <h2 className="mt-2">{props.title}</h2>}
      <hr />
    </header>
  );
};
