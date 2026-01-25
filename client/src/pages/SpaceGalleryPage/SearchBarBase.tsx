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
import SpaceTagList from "src/context/SpaceTagList";

function SpaceGallerySearchBarBase({
    className,
    placeholder="What are you looking for?",
    SearchSettingsButton=DefaultSearchSetingsButton,
    SearchSubmitButton=DefaultSearchSubmitButton,
    PageChangeButton=DefaultPageChangeButton,
    ...props
}: SpaceGallerySearchBarProps["functional"]) {
    const {
        q, setQ
    } = useSpaceGallerySearchParamState();
    const [ctx] = SpaceTagList.useContext(["queryJustChanged"]);
    const { runSearch, runGetAll } = useSpaceGallerySearchFunctions();
    const { _try } = useManualErrorHandling();
    const [{ suspend }] = useSuspenseController();

    const formControlRef = useRef<HTMLInputElement>(null);

    const updateResults = useCallback(() => {
        if (q.length !== 0) {
            _try(() => suspend(runSearch));
        } else {
            _try(() => suspend(runGetAll));
        }
    }, [q, _try, suspend, runSearch, runGetAll]);

    useEffect(() => {
        // If the query was changed in a way other than pressing enter or clicking the submit button
        if (ctx.queryJustChanged) {
            formControlRef.current!.focus();
            updateResults();
        }
        ctx.queryJustChanged = false;
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
                onChange={(e) => {
                    if (e.target.value.length !== 0) ctx.queryJustChanged = false;
                    setQ(e.target.value)
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        // Prevent form submission
                        e.preventDefault();
                        ctx.queryJustChanged = true;
                        updateResults();
                    }
                }}
            />

            <div className="buttons">
                <PageChangeButton type="prev">Previous Page</PageChangeButton>
                <PageChangeButton type="next">Next Page</PageChangeButton>

                <SearchSubmitButton onClick={() => {
                    ctx.queryJustChanged = true;
                    updateResults();
                }} />

                <SearchSettingsButton onApply={() => {
                    ctx.queryJustChanged = true;
                    updateResults();
                }} />
            </div>
        </Form>
    )
}

export function applySubComponents<
    T extends typeof SpaceGallerySearchBarBase
>(C: T) {
    return Object.assign(C, {
        SearchSettingsButton: DefaultSearchSetingsButton,
        SearchSubmitButton: DefaultSearchSubmitButton,
        PageChangeButton: DefaultPageChangeButton
    });
}

export default applySubComponents(SpaceGallerySearchBarBase);