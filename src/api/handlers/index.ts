const paths = {
    plex: process.env.PLEX_URL,
};

type PathsKeys = keyof typeof paths;

export const FetchBuilder = (
    base: PathsKeys,
    params?: [
        {
            name: string;
            value: string;
        }
    ],
    init?: RequestInit
) => {
    const basePath = paths[base];

    return (path: string) => {
        const url = new URL(path, basePath);

        if (params) {
            params.forEach((param) => {
                url.searchParams.append(param.name, param.value);
            });
        }

        return fetch(url, init);
    };
};
