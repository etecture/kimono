import React from 'react';
import cx from 'classnames';
import path from 'path';
import { shell } from 'electron';

import { FormValues } from '../form-schema';
import { IPty } from 'node-pty';
import { ButtonGroup } from 'renderer/components/button-group/button-group';
import { doneMessage } from '@kimono/generator-package/lib/doneMessage';
import XTerminal from '@kimono/xpty';
import { createCLICommand } from '../utils';
import { forwardSlashes } from 'renderer/utils/slashes';
import { CollapsibleCard } from 'renderer/components/collapsible/collapsible-card';
import { NavLink } from 'renderer/components/nav-link/NavLink';
import { store } from 'renderer/screens/create-project/store';

export interface CreateStepProps {
  pty: IPty | null;
  values: FormValues;
  onStart: () => void;
  onKill: () => void;
  onAbort: () => void;
  onFinished: () => void;
  isBusy: boolean;
  isFinished: boolean;
}

export const CreateStep: React.FC<CreateStepProps> = props => {
  React.useEffect(() => {
    if (props.pty) {
      const { dispose } = props.pty.onData(data => {
        if (data.includes(doneMessage)) {
          props.onFinished();
        }
      });
      return () => dispose();
    }
    return () => null;
  }, [props.pty]);

  return (
    <>
      <CollapsibleCard
        title="Details"
        initialCollapsed={store.get('detailsCollapsed', false)}
        className="mt-3"
        titleExtra={<LaunchButton {...props} />}
        onToggle={(collapsed: boolean) => store.set('detailsCollapsed', collapsed)}
      >
        <Summary {...props} />
        <ControlButtons {...props} />
        <XTerminal pty={props.pty} />
      </CollapsibleCard>
      {props.isFinished && <Finished {...props} />}
    </>
  );
};

const LaunchButton: React.FC<CreateStepProps> = props => (
  <button
    type="button"
    className={cx('button', {
      'is-loading': props.isBusy,
      'is-primary': !props.isFinished,
      'is-success is-unclickable': props.isFinished
    })}
    children={props.isFinished ? 'Done!' : 'Create project'}
    onClick={props.onStart}
  />
);
const ControlButtons: React.FC<CreateStepProps> = props => (
  <ButtonGroup className="mb-2" right>
    <button className={cx('button is-danger', { 'is-hidden': !props.pty })} type="button" onClick={props.onKill}>
      Kill
    </button>
    {props.isBusy && (
      <button className={cx('button is-warning', { 'is-hidden': !props.pty })} type="button" onClick={props.onAbort}>
        Abort
      </button>
    )}
  </ButtonGroup>
);
const Summary: React.FC<CreateStepProps> = props => (
  <ul>
    <li>
      location: <code>{forwardSlashes(props.values.cwd)}</code>
    </li>
    <li>
      {process.env.NODE_ENV === 'development' ? (
        <span className="tag is-info mr-1" title="The command will be different in production mode">
          DEV
        </span>
      ) : null}
      <span>
        command: <code> {forwardSlashes(createCLICommand(props.values, ['cwd']))} </code>
      </span>
    </li>
  </ul>
);

const Finished: React.FC<CreateStepProps> = props => (
  <ButtonGroup className="mt-3" right>
    <button
      className="button"
      onClick={() => {
        shell.openExternalSync(
          path.resolve(props.values.cwd, props.values.packageScope || '', props.values.packageName!),
          {
            activate: true
          }
        );
      }}
    >
      Open folder
    </button>
    <NavLink.Button to="/" primary>
      Finish
    </NavLink.Button>
  </ButtonGroup>
);
