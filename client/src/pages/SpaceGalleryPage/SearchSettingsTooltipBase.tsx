import { Tooltip } from "react-tooltip";
import { SearchSettingsTooltipProps, SpaceGallerySearchParams } from "./Types";
import useSpaceGallerySearchParamState from "./SearchParams";
import { Button, Form } from "react-bootstrap";
import { useCallback, useRef } from "react";
import { interpretSortOrder } from "shared";
import { Spacer } from "@ptolemy2002/react-utils";

export default function SpaceGallerySearchSettingsTooltipBase({
    id="search-settings-tooltip",
    className,
    hide,
    ...props
}: SearchSettingsTooltipProps["functional"]) {
    const {
        so, setSo,
        sb, setSb,
        cat, setCat,
        cs, setCs,
        mw, setMw,
        as, setAs,
        i, setI,
        ps, setPs
    } = useSpaceGallerySearchParamState();
    const pageSizeRef = useRef<HTMLInputElement | null>(null);

    const onSortOrderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SpaceGallerySearchParams["so"];
        if (value === "random") {
            setSo("rand");
        } else if (value === "1") {
            setSo("asc");
        } else {
            setSo("desc");
        }
    }, [setSo]);

    const onSortByChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SpaceGallerySearchParams["sb"];
        setSb(value);
    }, [setSb]);

    const onCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SpaceGallerySearchParams["cat"];

        if (value !== "general" && sb === "score") {
            setSb("name");
        } else if (value === "general") {
            setSb("score");
        }

        setCat(value);
    }, [setCat, sb, setSb]);

    const onCaseSensitiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        setCs(value);
    }, [setCs]);

    const onMatchWholeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        setMw(value);
    }, [setMw]);

    const onAccentSensitiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        setAs(value);
    }, [setAs]);

    const onInvertChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        setI(value);
    }, [setI]);

    const onPageSizeChange = useCallback(() => {
        const value = parseInt(pageSizeRef.current?.value ?? "");
        if (isNaN(value) || value < 1) return;

        setPs(value);
        hide();
    }, [setPs, hide]);

    const interpretedSo = interpretSortOrder(so);
    return (
        <Tooltip
            id={id}
            delayHide={100}
            clickable
            {...props}
            className={className}
        >
                <div className="input-container">
                    <Form.Label htmlFor="sort-order">Sort Order</Form.Label>
                    <Form.Select value={interpretedSo} onChange={onSortOrderChange} name="sort-order">
                        <option value={1}>Ascending</option>
                        <option value={-1}>Descending</option>
                        <option value="random">Random</option>
                    </Form.Select>
                </div>

                <div className="input-container">
                    <Form.Label htmlFor="sort-by">Sort By</Form.Label>
                    <Form.Select as="select" value={sb} name="sort-by" onChange={onSortByChange}>
                        <option value="score" disabled={cat !== "general"}>Score</option>
                        <option value="id">Arbitrary</option>
                        <option value="name">Name</option>
                        <option value="alias">Alias</option>
                        <option value="known-as">Name or Alias</option>
                        <option value="description">Description</option>
                        <option value="example">Example</option>
                        <option value="tag">Tag</option>
                    </Form.Select>
                </div>

                <div className="input-container">
                    <Form.Label htmlFor="category">Search Category</Form.Label>
                    <Form.Select as="select" value={cat} name="category" onChange={onCategoryChange}>
                        <option value="general">General</option>
                        <option value="name">Name</option>
                        <option value="known-as">Name or Alias</option>
                        <option value="alias">Alias</option>
                        <option value="description">Description</option>
                        <option value="example">Example</option>
                        <option value="tag">Tag</option>
                    </Form.Select>
                </div>
                
                <Spacer />

                <div className="input-container">
                    <Form.Label htmlFor="case-sensitive">Case Sensitive</Form.Label>
                    <Form.Check type="checkbox" name="case-sensitive" checked={cs} onChange={onCaseSensitiveChange} />
                </div>

                <div className="input-container">
                    <Form.Label htmlFor="match-whole">Match Whole</Form.Label>
                    <Form.Check type="checkbox" name="match-whole" checked={mw} onChange={onMatchWholeChange} />
                </div>

                <div className="input-container">
                    <Form.Label htmlFor="accent-sensitive">Accent Sensitive</Form.Label>
                    <Form.Check type="checkbox" name="accent-sensitive" checked={as} onChange={onAccentSensitiveChange} />
                </div>

                <div className="input-container">
                    <Form.Label htmlFor="invert">Invert Search</Form.Label>
                    <Form.Check type="checkbox" name="invert" checked={i} onChange={onInvertChange} />
                </div>

                <Spacer />

                <div className="input-container">
                    <Form.Label htmlFor="page-size">Items Per Page</Form.Label>
                    <Form.Control type="number" name="page-size" defaultValue={ps} ref={pageSizeRef} />
                    <Button className="page-size-apply-button" onClick={onPageSizeChange}>Apply</Button>
                </div>
        </Tooltip>
    )
}