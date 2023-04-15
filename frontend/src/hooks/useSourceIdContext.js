import { useContext } from 'react';
import { SourceIdContext } from "../context/SourceIdContext";

const useSourceIdContext = () => {
    const sourceId = useContext(SourceIdContext);
    if (sourceId === undefined) {
        throw new Error("useSourceIdContext can only be used inside AuthProvider");
    }
    return sourceId;
};

export default useSourceIdContext;
