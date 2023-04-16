import { useContext } from 'react';
import { SourceIdContext } from "../context/SourceIdContext";

const useSourceIdContext = () => {
    const source = useContext(SourceIdContext);
    if (source === undefined) {
        throw new Error("useSourceIdContext can only be used inside AuthProvider");
    }
    return source;
};

export default useSourceIdContext;
