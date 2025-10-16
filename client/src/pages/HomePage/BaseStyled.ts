import styled from "styled-components";
import { HomePageProps } from "./Types";
import Base, {applySubComponents} from "./Base";
import { marginY } from "@ptolemy2002/react-styled-component-utils";

export default applySubComponents(Object.assign(
    styled(Base).attrs<HomePageProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        .list-category-select {
            width: 100%;
            ${marginY("1rem")}
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(HomePage)",
    }
));