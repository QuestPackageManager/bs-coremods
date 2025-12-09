export interface CoreMods {
    lastUpdated: string;
    mods:        Mod[];
}

export interface Mod {
    id:           string;
    version:      string;
    downloadLink: string;
    filename?:    string;
}