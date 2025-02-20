import styled from "styled-components";
import { SpaceGalleryPageProps } from "./Types";
import Base, {applySubComponents} from "./Base";

export default applySubComponents(Object.assign(
    styled(Base).attrs<SpaceGalleryPageProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGalleryPage)",
    }
));