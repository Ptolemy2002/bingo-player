import SVG from 'react-inlinesvg';
import { ComponentProps, FC } from 'react';
import HTMLComment from 'react-html-comment';
import { useEnv } from 'src/Env';

export type DefaultLoaderProps = Omit<ComponentProps<typeof SVG>, 'src' | 'cacheRequests'>;
export function DefaultLoader({className, ...props}: DefaultLoaderProps) {
    return <SVG className={`loader ${className}`} src="/icons/hourglass.svg" cacheRequests={true} {...props} />;
}

export type StaticSrcSVGProps = Omit<ComponentProps<typeof SVG>, 'src'>;
export default function StaticSrcSVG(src: string, Loader: FC<DefaultLoaderProps> = DefaultLoader) {
    return Object.assign(
        (_props: StaticSrcSVGProps) => {
            // The linter recognizes this as a callback rather than a component function
            // itself. This causes a warning, as hooks are not allowed in callbacks.
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const env = useEnv();
            const {className, cacheRequests=env.isProd, ...props} = _props;
            
            return <>
                <HTMLComment text={`[SVG] ${src}`} />
                <SVG
                    className={className}
                    cacheRequests={cacheRequests}
                    src={src}
                    loader={<Loader className={className} {...props} />}
                    {...props}
                />
            </>
        },
        { 
            displayName: `${src}(SVG)`
        }
    );
}