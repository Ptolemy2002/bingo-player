import { Form } from "react-bootstrap";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGallerySearchBarProps } from "./Types";
import DefaultSearchSetingsButton from "./SearchSettingsButtonStyled";
import DefaultSearchSubmitButton from "./SearchSubmitButtonStyled";

export default function SpaceGallerySearchBarBase({
    className,
    placeholder="What are you looking for?",
    SearchSettingsButton=DefaultSearchSetingsButton,
    SearchSubmitButton=DefaultSearchSubmitButton,
    ...props
}: SpaceGallerySearchBarProps["functional"]) {
    const { q, setQ } = useSpaceGallerySearchParamState();

    return (
        <Form className={className} {...props}>
            <Form.Control
                type="text"
                className="input"
                placeholder={placeholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />

            <div className="buttons">
                <SearchSubmitButton />
                <SearchSettingsButton />
            </div>
        </Form>
    )
}