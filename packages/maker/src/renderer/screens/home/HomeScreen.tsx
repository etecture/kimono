import React from 'react';

import { Screen } from 'renderer/components/screen/Screen';
import { NavLink } from 'renderer/components/nav-link/NavLink';
import { ButtonGroup } from 'renderer/components/button-group/button-group';

export const HomeScreen = () => (
  <Screen className="HomeScreen is-flex-1 is-flex is-vcentered has-text-centered">
    <ButtonGroup>
      <NavLink.Button primary to="/create-package/configure" className="m-auto">
        Create package
      </NavLink.Button>
      <NavLink.Button primary to="/create-project/configure" className="m-auto">
        Create electron app
      </NavLink.Button>
    </ButtonGroup>
  </Screen>
);
