import React, { createContext, useState } from 'react';

export const SourceIdContext = createContext({
    sourceId: null,
    setSourceId: () => { },
    sourceTitle: null,
    setSourceTitle: () => { },
    sourceLink: null,
    setSourceLink: () => { }
});

export const SourceIdProvider = ({ children }) => {
    const [sourceId, setSourceId] = useState(null);
    const [sourceTitle, setSourceTitle] = useState(null);
    const [sourceLink, setSourceLink] = useState(null);
    return (
        <SourceIdContext.Provider value={{ sourceId, setSourceId, sourceTitle, setSourceTitle, sourceLink, setSourceLink }}>{children}</SourceIdContext.Provider>
    )
}
