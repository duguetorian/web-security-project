import data from '../rss_example.json';


let sourceContent = [
    { name: "Source#1", id: "1" },
    { name: "Source#2", id: "2" },
    { name: "Source#3", id: "3" },
    { name: "Source#4", id: "4" },
    { name: "Source#5", id: "5" },
    { name: "Source#6", id: "6" },
    { name: "Source#7", id: "7" },
    { name: "Source#8", id: "8" },
    { name: "Source#9", id: "9" },
    { name: "Source#10", id: "10" },
    { name: "Source#11", id: "11" },
    { name: "Source#12", id: "12" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
    { name: "Source#13", id: "13" },
]


export const getSources = (username, token) => {
    return sourceContent;
}

export const addSource = (username, token, link) => {
    try {
        let domain = new URL(link)
        sourceContent.push({ name: domain.hostname, id: domain.hostname })
        return true
    } catch (error) {
        return false
    }
}

export const getLastArticles = (username, token, range) => {
    const numberOfPages = 5;
    return {lastArticles : Array(range).fill(data), numberOfPages}
}
