import StaticSrcSVG, { StaticSrcSVGProps } from './Base';
import { RequiredCSSProperties, WithCSSProp } from '@ptolemy2002/react-styled-component-utils';
import styled from 'styled-components';

// Side effect import so that the compiler knows this is being used
import "/icons/moon.svg";

export type MoonIconStyleAttributes = {
    $color?: RequiredCSSProperties['fill'] | null;
    $width?: RequiredCSSProperties['width'];
    $height?: RequiredCSSProperties['height'];
};

export type MoonIconProps = WithCSSProp<MoonIconStyleAttributes> & StaticSrcSVGProps;

const SVG = StaticSrcSVG('/icons/moon.svg');

export default Object.assign(
    styled(SVG).attrs<MoonIconProps>(
        ({theme, ...props}) => ({
            $color: props.$color ?? theme.icons?.moon?.color ?? theme.textColor,
            $width: props.$width ?? '24px',
            $height: props.$height ?? 'auto',
            $css: props.$css ?? null
        })
    )`
        width: ${({$width}) => $width};
        height: ${({$height}) => $height};

        > path {
            fill: ${({$color}) => $color};
        }

        &.loader {
            > path {
                fill: ${({$color}) => $color};
            }
        }

        ${({$css}) => $css}
    `,
    {
        displayName: 'MenuIcon'
    }
);