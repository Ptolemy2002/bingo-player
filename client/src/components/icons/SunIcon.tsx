import StaticSrcSVG, { StaticSrcSVGProps } from './Base';
import { RequiredCSSProperties, WithCSSProp } from '@ptolemy2002/react-styled-component-utils';
import styled from 'styled-components';

// Side effect import so that the compiler knows this is being used
import "/icons/sun.svg";

export type SunIconStyleAttributes = {
    $color?: RequiredCSSProperties['fill'] | null;
    $width?: RequiredCSSProperties['width'];
    $height?: RequiredCSSProperties['height'];
};

export type SunIconProps = WithCSSProp<SunIconStyleAttributes> & StaticSrcSVGProps;

const SVG = StaticSrcSVG('/icons/sun.svg');

export default Object.assign(
    styled(SVG).attrs<SunIconProps>(
        ({theme, ...props}) => ({
            $color: props.$color ?? theme.icons?.sun?.color ?? "currentcolor",
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
        displayName: 'SunIcon'
    }
);