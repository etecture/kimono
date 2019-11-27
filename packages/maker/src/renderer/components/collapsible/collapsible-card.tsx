import React, { ReactChild, MouseEvent, useCallback } from 'react';
import cx from 'classnames';
interface CollapsibleCardProps {
  title?: string;
  className?: string;
  children?: ReactChild | ReactChild[] | null;
  titleExtra?: ReactChild | ReactChild[] | null;
  initialCollapsed?: boolean;
  noPadding?: boolean;
}
export const CollapsibleCard: React.FC<CollapsibleCardProps> = React.memo(props => {
  const [collapsed, setCollapsed] = React.useState(props.initialCollapsed);
  const toggleCollapsed = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).matches('.title-extra *')) {
        return;
      }
      setCollapsed(!collapsed);
    },
    [collapsed]
  );

  const iconClass = cx('fas', `fa-angle-${collapsed ? 'right' : 'down'}`);

  return (
    <div className={cx(props.className, 'CollapsibleCard card')}>
      <header className="is-clickable card-header is-clickable" onClick={toggleCollapsed}>
        <div className="card-header-icon">
          <span className="icon" key={iconClass}>
            <i className={iconClass} />
          </span>
        </div>
        <div className="card-header-title is-flex is-flex-1 pl-0">
          <span className="title-text is-flex-1">{props.title}</span>
          {props.titleExtra && <div className="title-extra">{props.titleExtra}</div>}
        </div>
      </header>
      {!collapsed && (
        <div className={cx('card-content', { 'p-0': props.noPadding })}>
          <div className="Collapsible-content">{props.children}</div>
        </div>
      )}
    </div>
  );
});
