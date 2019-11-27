import React from 'react';

import { Screen } from 'renderer/components/screen/Screen';
import { NavLink } from 'renderer/components/nav-link/NavLink';

export const HomeScreen = () => (
  <Screen className="HomeScreen is-flex-1 is-flex is-vcentered has-text-centered">
    <NavLink.Button primary to="/create-project/configure" className="m-auto">
      Create electron app
    </NavLink.Button>
  </Screen>
);
