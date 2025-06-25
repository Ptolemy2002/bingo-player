import { SpaceCreateButtonProps } from "./Types";
import StyledButton from "src/components/StyledButton";
import getApi, { invalidateSpaceCollectionCaches } from "src/Api";
import { useNavigate } from "react-router";
import { NewSpace200ResponseBody } from "shared";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import { useState } from "react";
import SpaceData from "src/data/SpaceData";

export default function SpaceCreateButton(props: SpaceCreateButtonProps) {
    const navigate = useNavigate();
    const { _try } = useManualErrorHandling();
    const [loading, setLoading] = useState(false);
    const [, setSpace] = SpaceData.useContext([]);

    return (
        <StyledButton 
            {...props}
            $variant="createSpace"
            onClick={() => _try(async () => {
                setLoading(true);
                await handleClick(
                    (response) => {
                        // Set Here so we don't have to pull later. Add a manual pull checkpoint
                        // so differences are detected correctly.
                        setSpace(response.space)?.checkpoint("pull");
                        navigate(`/space/${encodeURIComponent(response.space.name)}/edit`, {});
                    }
                );
                setLoading(false);
            })}
            disabled={loading}
        >
            Create Space
        </StyledButton>
    );
}

async function handleClick(onSuccess?: (response: NewSpace200ResponseBody) => void) {
    const api = getApi();

    const response = await api.post("/spaces/new", {
        space: {
            name: "New Space",
            description: "A new space created from the gallery page."
        }
    });

    if (response.data.ok) {
        await invalidateSpaceCollectionCaches();
        onSuccess?.(response.data);
    }
}