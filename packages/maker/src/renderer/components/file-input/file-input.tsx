import React, { ReactNode } from 'react';
import cx from 'classnames';
import { remote } from 'electron';
import setNativeInputValue from './set-native-input-value';

import styled from 'styled-components';
import { forwardSlashes } from 'renderer/utils/slashes';

const StyledContainer = styled.div`
  input {
    padding: 5px 9px;
  }
`;

const { dialog, getCurrentWindow } = remote;

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // onSelect?: (path: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  buttonLabel?: string;
  icon?: ReactNode | null;
  openFile?: boolean;
  openDirectory?: boolean;
  multiSelections?: boolean;
}

type DialogProperties = Array<'openFile' | 'openDirectory' | 'multiSelections'>;

type ExtractedClassNames = { inner: string[]; outer: string[] };

function extractClassNames(className?: string): ExtractedClassNames {
  const result = { inner: [], outer: [] };
  if (!className) {
    return result;
  }
  return className.split(' ').reduce((result: ExtractedClassNames, className) => {
    if (className.startsWith('is-')) {
      result.inner.push(className);
    } else {
      result.outer.push(className);
    }
    return result;
  }, result);
}

export const FileInput: React.FC<FileInputProps> = React.memo(
  ({
    openFile = true,
    openDirectory = false,
    multiSelections = false,
    buttonLabel = '…',
    icon,
    // common props
    className,
    onChange,

    ...props
  }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    //
    const handleBrowse = React.useCallback(() => {
      if (!inputRef.current) {
        return;
      }

      const properties: DialogProperties = [];
      if (openFile) properties.push('openFile');
      if (openDirectory) properties.push('openDirectory');
      if (multiSelections) properties.push('multiSelections');

      const selection = dialog.showOpenDialog(getCurrentWindow(), {
        properties
      });
      if (selection) {
        setNativeInputValue(inputRef.current, forwardSlashes(selection[0]), true);
      }
    }, [onChange, openFile, openDirectory, multiSelections, inputRef.current]);

    const { outer: outerClassNames, inner: innerClassNames } = extractClassNames(className);
    return (
      <StyledContainer className={cx('FileInput file has-name is-right is-fullwidth is-flex-1', ...outerClassNames)}>
        <input className="file-input" type="file" name="resume" tabIndex={-1} />
        <label className="file-label">
          <input
            {...props}
            ref={inputRef}
            readOnly={!onChange}
            className={cx('file-name input', ...innerClassNames)}
            type="text"
            onChange={onChange}
          />
          <button type="button" className={cx('button file-cta', ...innerClassNames)} onClick={handleBrowse}>
            {icon && <span className="file-icon">{icon}</span>}
            <span className="file-label">{buttonLabel}</span>
          </button>
        </label>
      </StyledContainer>
    );
  }
);
