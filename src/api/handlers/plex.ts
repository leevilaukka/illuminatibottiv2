import Parser from "rss-parser";
import { FetchBuilder } from ".";
import fs from "fs"
export interface PlexLibraryResponse {
    MediaContainer: MediaContainer
}

interface MediaContainer {
    size: number;
    allowSync: boolean;
    art: string;
    identifier: string;
    librarySectionID: number;
    librarySectionTitle: string;
    librarySectionUUID: string;
    mediaTagPrefix: string;
    mediaTagVersion: number;
    nocache: boolean;
    thumb: string;
    title1: string;
    title2: string;
    viewGroup: string;
    viewMode: number;
    Metadata: Metadata[];
}

interface Metadata {
    ratingKey: string;
    key: string;
    guid: string;
    type: string;
    title: string;
    summary: string;
}

export const fetchPlex = FetchBuilder("plex", 
    {
        headers: {
            "Accept": "application/json"
        }
    },
    [
    {
        name: "X-Plex-Token",
        value: process.env.PLEX_TOKEN
    },
])


export const getAllLibraries = async () => {
    const data = await fetchPlex("/library/sections")
   
    const json = await data.json()
    
    return json
}

export const getLibraryByID = async (id: string) => {
    const data = await fetchPlex(`/library/sections/${id}/all`)

    const json = await data.json()

    return json as PlexLibraryResponse
}

export const getItemByID = async (id: string) => {
    const data = await fetchPlex(`/library/metadata/${id}`)

    return await data.json()
}

export const getSongsByID = async (id: string) => {
    const artist = await getItemByID(id)
    const artistPath = artist.MediaContainer.Directory.Location

    const songs = fs.readdirSync(artistPath)

    return songs
}