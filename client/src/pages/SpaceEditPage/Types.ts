import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { FieldErrors, UseFormRegister } from "react-hook-form";
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
        }
    >,
{}>;

export type SpaceEditPageBodyProps = Required<
    Pick<
        SpaceEditPageProps["functional"],
        "NameField"
    >
>;

export type CustomFormFieldProps<T> = {
    label?: string;
    placeholder?: string;
    register: UseFormRegister<MongoSpace>;
    errors?: FieldErrors<MongoSpace>;
    defaultValue?: T;
};

export type SpaceEditNameFieldProps = Override<
    FormGroupProps,
    CustomFormFieldProps<MongoSpace["name"]>
>;