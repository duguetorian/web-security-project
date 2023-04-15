import React, { createContext, useState } from 'react';

export const SourceIdContext = createContext({
    sourceId: null,
    setSourceId: () => { },
    sourceTitle: null,
    setSourceTitle: () => { }
});

export const SourceIdProvider = ({ children }) => {
    const [sourceId, setSourceId] = useState(null);
    const [sourceTitle, setSourceTitle] = useState(null);
    return (
        <SourceIdContext.Provider value={{ sourceId, setSourceId, sourceTitle, setSourceTitle }}>{children}</SourceIdContext.Provider>
    )
}
