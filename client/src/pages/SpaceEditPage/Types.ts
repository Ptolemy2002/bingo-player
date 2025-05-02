import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { MongoSpace } from "shared";
import { FC, HTMLProps } from "react";
import { Override } from "@ptolemy2002/ts-utils";
import { FormGroupProps } from "react-bootstrap";

export type SpaceEditPageProps = StyledComponentPropsWithCSS<
    Override<
        Omit<HTMLProps<HTMLDivElement>, "children">,
        {
            className?: string;
            NameField?: FC<SpaceEditNameFieldProps>;
            AliasesField?: FC<SpaceEditAliasesFieldProps>;
        }
    >,
{}>;

export type SpaceEditPageBodyProps = Required<
    Pick<
        SpaceEditPageProps["functional"],
        "NameField" | "AliasesField"
    >
>;

export type CustomFormFieldProps<T> = {
    label?: string;
    placeholder?: string;
    defaultValue?: T;
};

export type SpaceEditNameFieldProps = Override<
    Omit<FormGroupProps, "children">,
    CustomFormFieldProps<MongoSpace["name"]>
>;

export type SpaceEditAliasesFieldProps = Override<
    Omit<FormGroupProps, "children">,
    CustomFormFieldProps<MongoSpace["aliases"]>
>;