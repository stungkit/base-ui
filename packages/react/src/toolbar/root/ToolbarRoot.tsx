'use client';
import * as React from 'react';
import { BaseUIComponentProps, Orientation } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { CompositeRoot } from '../../composite/root/CompositeRoot';
import { ToolbarRootContext } from './ToolbarRootContext';
import { useToolbarRoot } from './useToolbarRoot';

/**
 * A container for grouping a set of controls, such as buttons, toggle groups, or menus.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Toolbar](https://base-ui.com/react/components/toolbar)
 */
export const ToolbarRoot = React.forwardRef(function ToolbarRoot(
  props: ToolbarRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    cols = 1,
    disabled = false,
    loop = true,
    orientation = 'horizontal',
    className,
    render,
    ...otherProps
  } = props;

  const { getRootProps, disabledIndices, setItemMap } = useToolbarRoot({
    disabled,
    orientation,
  });

  const toolbarRootContext: ToolbarRootContext = React.useMemo(
    () => ({
      disabled,
      orientation,
      setItemMap,
    }),
    [disabled, orientation, setItemMap],
  );

  const state = React.useMemo(() => ({ disabled, orientation }), [disabled, orientation]);

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'div',
    className,
    state,
    extraProps: otherProps,
    ref: forwardedRef,
  });

  return (
    <ToolbarRootContext.Provider value={toolbarRootContext}>
      <CompositeRoot
        cols={cols}
        disabledIndices={disabledIndices}
        loop={loop}
        onMapChange={setItemMap}
        orientation={orientation}
        render={renderElement()}
      />
    </ToolbarRootContext.Provider>
  );
});

export interface ToolbarItemMetadata {
  focusableWhenDisabled: boolean;
}

export namespace ToolbarRoot {
  export type State = {
    disabled: boolean;
    orientation: Orientation;
  };

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The number of columns. When greater than 1, the toolbar is arranged into
     * a grid.
     * @default 1
     */
    cols?: number;
    disabled?: boolean;
    /**
     * The orientation of the toolbar.
     * @default 'horizontal'
     */
    orientation?: Orientation;
    /**
     * If `true`, using keyboard navigation will wrap focus to the other end of the toolbar once the end is reached.
     *
     * @default true
     */
    loop?: boolean;
  }
}
