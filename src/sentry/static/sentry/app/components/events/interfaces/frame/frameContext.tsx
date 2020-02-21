import React from 'react';
import {css} from '@emotion/core';

import {SentryAppComponent} from 'app/types';
import {t} from 'app/locale';
import {defined} from 'app/utils';
import ClippedBox from 'app/components/clippedBox';
import ContextLine from 'app/components/events/interfaces/contextLine';
import FrameRegisters from 'app/components/events/interfaces/frameRegisters';
import FrameVariables from 'app/components/events/interfaces/frameVariables';
import ErrorBoundary from 'app/components/errorBoundary';
import {Assembly} from 'app/components/events/interfaces/assembly';
import {parseAssembly} from 'app/components/events/interfaces/utils';
import OpenInContextLine from 'app/components/events/interfaces/openInContextLine';

import {Data} from './types';

type Props = {
  data: Data;
  isExpanded?: boolean;
  hasContextSource?: boolean;
  hasContextVars?: boolean;
  hasContextRegisters?: boolean;
  hasAssembly?: boolean;
  expandable?: boolean;
  registers: {[key: string]: string};
  components: Array<SentryAppComponent>;
};

const FrameContext = ({
  hasContextVars = false,
  hasContextSource = false,
  hasContextRegisters = false,
  isExpanded = false,
  hasAssembly = false,
  expandable = false,
  registers,
  components,
  data,
}: Props) => {
  if (!(hasContextSource || hasContextVars || hasContextRegisters || hasAssembly)) {
    return (
      <div className="empty-context">
        <span className="icon icon-exclamation" />
        <p>{t('No additional details are available for this frame.')}</p>
      </div>
    );
  }

  const getContextLines = () => {
    if (isExpanded) {
      return data.context;
    }
    return data.context.filter(l => l[0] === data.lineNo);
  };

  const contextLines = getContextLines();

  const startLineNo = hasContextSource ? data.context[0][0] : undefined;

  return (
    <ol start={startLineNo} className={`context ${isExpanded ? 'expanded' : ''}`}>
      {defined(data.errors) && (
        <li className={expandable ? 'expandable error' : 'error'} key="errors">
          {data.errors.join(', ')}
        </li>
      )}

      {data.context &&
        contextLines.map((line, index) => {
          const isActive = data.lineNo === line[0];
          const hasComponents = isActive && components.length > 0;
          return (
            <ContextLine
              key={index}
              line={line}
              isActive={isActive}
              css={
                hasComponents
                  ? css`
                      background: inherit;
                      padding: 0;
                      text-indent: 20px;
                      z-index: 1000;
                    `
                  : css`
                      background: inherit;
                      padding: 0 20px;
                    `
              }
            >
              {hasComponents && (
                <ErrorBoundary mini>
                  <OpenInContextLine
                    key={index}
                    lineNo={line[0]}
                    filename={`Oi ${data.filename}`}
                    components={components}
                  />
                </ErrorBoundary>
              )}
            </ContextLine>
          );
        })}

      {(hasContextRegisters || hasContextVars) && (
        <ClippedBox clipHeight={100}>
          {hasContextRegisters && <FrameRegisters data={registers} key="registers" />}
          {hasContextVars && <FrameVariables data={data.vars} key="vars" />}
        </ClippedBox>
      )}

      {hasAssembly && (
        <Assembly {...parseAssembly(data.package)} filePath={data.absPath} />
      )}
    </ol>
  );
};

export default FrameContext;
