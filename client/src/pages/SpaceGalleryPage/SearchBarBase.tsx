import { Form } from "react-bootstrap";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGallerySearchBarProps } from "./Types";
import DefaultSearchSetingsButton from "./SearchSettingsButton";
import DefaultSearchSubmitButton from "./SearchSubmitButton";
import DefaultPageChangeButton from "./PageChangeButton";
import { useSpaceGallerySearchFunctions } from "./Controllers";
import { useCallback, useEffect, useRef } from "react";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import { useSuspenseController } from "@ptolemy2002/react-suspense";

export default function SpaceGallerySearchBarBase({
    className,
    placeholder="What are you looking for?",
    SearchSettingsButton=DefaultSearchSetingsButton,
    SearchSubmitButton=DefaultSearchSubmitButton,
    PageChangeButton=DefaultPageChangeButton,
    ...props
}: SpaceGallerySearchBarProps["functional"]) {
    const { q, setQ } = useSpaceGallerySearchParamState();
    const { runSearch, runGetAll } = useSpaceGallerySearchFunctions();
    const { _try } = useManualErrorHandling();
    const [{ suspend }] = useSuspenseController();

    const keyJustDownRef = useRef(false);
    const formControlRef = useRef<HTMLInputElement>(null);

    const updateResults = useCallback(() => {
        if (q.length !== 0) {
            _try(() => suspend(runSearch));
        } else {
            _try(() => suspend(runGetAll));
        }
    }, [q, _try, suspend, runSearch, runGetAll]);

    useEffect(() => {
        // If the query was changed in a way other than pressing enter
        if (!keyJustDownRef.current) {
            formControlRef.current!.value = q;
            formControlRef.current!.focus();
            updateResults();
        }
        keyJustDownRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    return (
        <Form className={className} {...props}>
            <Form.Control
                type="text"
                className="input"

                ref={formControlRef}
                placeholder={placeholder}
                defaultValue={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        // Prevent form submission
                        e.preventDefault();
                        keyJustDownRef.current = true;
                        updateResults();
                    }
                }}
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