import React from 'react';
import { hot } from 'react-hot-loader';
import { useHistory, Route } from 'react-router';
import { usePty } from '@loopmode/xpty';

import { Screen } from 'renderer/components/screen/Screen';

import { setValues, getValues } from './form-values';
import { createCLICommand } from './utils';
import { FormValues } from './form-schema';

import { ConfigureStep } from './steps/ConfigureStep';
import { CreateStep } from './steps/CreateStep';
import { StepHeader } from './steps/StepHeader';

export const CreateProjectScreen: React.FC<{ onDone: () => void }> = () => {
  const history = useHistory();
  const { pty, execute, abort, kill } = usePty();

  const [isFinished, setFinished] = React.useState(false);
  const [isBusy, setBusy] = React.useState(false);

  const handleSubmitForm = React.useCallback(
    (values: FormValues) => {
      setValues(values);
      history.push('/create-project/create');
    },
    [history]
  );

  const handleStart = React.useCallback(() => {
    const { cwd, ...values } = getValues();
    setFinished(false);
    setBusy(true);
    execute(createCLICommand(values), { cwd });
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
    <Screen className="CreateProjectScreen content">
      <Route
        path="/create-project/configure"
        render={() => {
          return (
            <>
              <StepHeader backLink="/" title="Configure" />
              <ConfigureStep onSubmit={handleSubmitForm} />
            </>
          );
        }}
      />
      <Route
        path="/create-project/create"
        render={() => {
          return (
            <>
              <StepHeader backLink="/create-project/configure" title="Create" />
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

export default hot(module)(CreateProjectScreen);
