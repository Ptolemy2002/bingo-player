import { Form } from "react-bootstrap";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGallerySearchBarProps } from "./Types";
import DefaultSearchSetingsButton from "./SearchSettingsButtonStyled";
import DefaultSearchSubmitButton from "./SearchSubmitButtonStyled";
import DefaultPageChangeButton from "./PageChangeButtonStyled";

export default function SpaceGallerySearchBarBase({
    className,
    placeholder="What are you looking for?",
    SearchSettingsButton=DefaultSearchSetingsButton,
    SearchSubmitButton=DefaultSearchSubmitButton,
    PageChangeButton=DefaultPageChangeButton,
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
                <PageChangeButton type="prev">Previous Page</PageChangeButton>
                <PageChangeButton type="next">Next Page</PageChangeButton>

                <SearchSubmitButton />
                <SearchSettingsButton />
            </div>
        </Form>
    )
}