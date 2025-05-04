import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { MongoSpace } from "shared";
import { FC, HTMLProps } from "react";
import { Override } from "@ptolemy2002/ts-utils";
import { FormControlProps, FormGroupProps } from "react-bootstrap";
import { UseFormRegisterReturn } from "react-hook-form";

type NonNull<T> = Exclude<T, null | undefined>;

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

export type CustomFormFieldItemProps<T> = {
    index: number;
    controlProps: Omit<FormControlProps, "children" | "defaultValue" | "type" | keyof UseFormRegisterReturn>;
    remove: () => void;
    defaultValue?: T;
}

export type SpaceEditNameFieldProps = Override<
    Omit<FormGroupProps, "children">,
    CustomFormFieldProps<MongoSpace["name"]>
>;

export type SpaceEditAliasesFieldProps = Override<
    Omit<FormGroupProps, "children">,
    CustomFormFieldProps<MongoSpace["aliases"]>
>;

export type SpaceEditAliasItemProps = Override<
    Omit<HTMLProps<HTMLLIElement>, "children">,
    CustomFormFieldItemProps<
        NonNull<MongoSpace["aliases"]>[number]
    >
>;