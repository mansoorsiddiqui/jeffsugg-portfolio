export const SCREEN_SIZE = {
    LARGE: 1440,
    MEDIUM: 1024,
    SMALL: 640
}

export interface Project {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    show: boolean;
}