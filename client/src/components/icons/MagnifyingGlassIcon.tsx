import StaticSrcSVG, { StaticSrcSVGProps } from './Base';
import { RequiredCSSProperties, WithCSSProp } from '@ptolemy2002/react-styled-component-utils';
import styled from 'styled-components';

// Side effect import so that the compiler knows this is being used
import "/icons/sun.svg";

export type MagnifyingGlassIconStyleAttributes = {
    $color?: RequiredCSSProperties['fill'] | null;
    $width?: RequiredCSSProperties['width'];
    $height?: RequiredCSSProperties['height'];
};

export type MagnifyingGlassIconProps = WithCSSProp<MagnifyingGlassIconStyleAttributes> & StaticSrcSVGProps;

const SVG = StaticSrcSVG('/icons/magnifying-glass.svg');

export default Object.assign(
    styled(SVG).attrs<MagnifyingGlassIconProps>(
        ({theme, ...props}) => ({
            $color: props.$color ?? theme.icons?.magnifyingGlass?.color ?? "currentcolor",
            $width: props.$width ?? '24px',
            $height: props.$height ?? 'auto',
            $css: props.$css ?? null
        })
    )`
        width: ${({$width}) => $width};
        height: ${({$height}) => $height};

        > path {
            stroke: ${({$color}) => $color};
        }

        &.loader {
            > path {
                fill: ${({$color}) => $color};
            }
        }

        ${({$css}) => $css}
    `,
    {
        displayName: 'MagnifyingGlassIcon'
    }
);