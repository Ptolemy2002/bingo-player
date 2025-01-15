import { Form } from "react-bootstrap";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGallerySearchBarProps } from "./Types";

export default function SpaceGallerySearchBarBase({
    className,
    placeholder="What are you looking for?"
}: SpaceGallerySearchBarProps["functional"]) {
    const { q, setQ } = useSpaceGallerySearchParamState();

    return (
        <Form className={className}>
            <Form.Control
                type="text"
                placeholder={placeholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
        </Form>
    )
}