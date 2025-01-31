import StaticSrcSVG, { StaticSrcSVGProps } from './Base';
import { RequiredCSSProperties, WithCSSProp } from '@ptolemy2002/react-styled-component-utils';
import styled from 'styled-components';

// Side effect import so that the compiler knows this is being used
import "/icons/sun.svg";

export type GearIconStyleAttributes = {
    $outerColor?: RequiredCSSProperties['fill'] | null;
    $innerColor?: RequiredCSSProperties['fill'] | null;
    $width?: RequiredCSSProperties['width'];
    $height?: RequiredCSSProperties['height'];
};

export type GearIconProps = WithCSSProp<GearIconStyleAttributes> & StaticSrcSVGProps;

const SVG = StaticSrcSVG('/icons/gear.svg');

export default Object.assign(
    styled(SVG).attrs<GearIconProps>(
        ({theme, ...props}) => ({
            $outerColor: props.$outerColor ?? theme.icons?.gear?.outerColor ?? "currentcolor",
            $innerColor: props.$innerColor ?? theme.icons?.gear?.innerColor ?? theme.backgroundColor,
            $width: props.$width ?? '24px',
            $height: props.$height ?? 'auto',
            $css: props.$css ?? null
        })
    )`
        width: ${({$width}) => $width};
        height: ${({$height}) => $height};

        > #outer {
            fill: ${({$outerColor}) => $outerColor};
        }

        > #inner {
            fill: ${({$innerColor}) => $innerColor};
        }

        &.loader {
            > path {
                fill: ${({$outerColor}) => $outerColor};
            }
        }

        ${({$css}) => $css}
    `,
    {
        displayName: 'GearIcon'
    }
);