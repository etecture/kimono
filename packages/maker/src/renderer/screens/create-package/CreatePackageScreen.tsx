import React from 'react';
import { hot } from 'react-hot-loader';
import { useHistory, Route } from 'react-router';
import { usePty } from '@kimono/xpty';

import { Screen } from 'renderer/components/screen/Screen';

import { setValues, getValues } from './form-values';
import { createCLICommand } from './utils';
import { FormValues } from './form-schema';

import { ConfigureStep } from './steps/ConfigureStep';
import { CreateStep } from './steps/CreateStep';
import { StepHeader } from './steps/StepHeader';

export const CreatePackageScreen: React.FC<{ onDone: () => void }> = () => {
  const history = useHistory();
  const { pty, execute, abort, kill } = usePty();

  const [isFinished, setFinished] = React.useState(false);
  const [isBusy, setBusy] = React.useState(false);

  const handleSubmitForm = React.useCallback(
    (values: FormValues) => {
      setValues(values);
      history.push('/create-package/create');
    },
    [history]
  );

  const handleStart = React.useCallback(() => {
    const values = getValues();
    setFinished(false);
    setBusy(true);
    execute(createCLICommand(values));
  }, [execute]);

  const handleKill = React.useCallback(() => {
    kill();
    setBusy(false);
    setFinished(false);
  }, [kill]);

  const handleAbort = React.useCallback(() => {
    abort();
    setBusy(false);
    setFinished(false);
  }, [abort]);

  const handleFinished = React.useCallback(() => {
    setBusy(false);
    setFinished(true);
  }, [kill]);

  return (
    <Screen className="CreatePackageScreen content">
      <Route
        path="/create-package/configure"
        render={() => {
          return (
            <>
              <StepHeader backLink="/" title="Configure new package" />
              <ConfigureStep onSubmit={handleSubmitForm} />
            </>
          );
        }}
      />
      <Route
        path="/create-package/create"
        render={() => {
          return (
            <>
              <StepHeader backLink="/create-package/configure" title="Create" />
              <CreateStep
                pty={pty}
                values={getValues()}
                onStart={handleStart}
                onFinished={handleFinished}
                onKill={handleKill}
                onAbort={handleAbort}
                isBusy={isBusy}
                isFinished={isFinished}
              />
            </>
          );
        }}
      />
    </Screen>
  );
};

export default hot(module)(CreatePackageScreen);
