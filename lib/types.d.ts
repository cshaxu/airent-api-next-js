type NextCacheOptions = {
    revalidate?: number | false;
    tags?: string[];
};
type NextErrorProps = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
};
type NextSearchParams = {
    [key: string]: string | string[] | undefined;
};
type NextPageProps<PARAMS = {}, SEARCH_PARAMS = NextSearchParams> = {
    params: PARAMS;
    searchParams: SEARCH_PARAMS;
};
export { NextCacheOptions, NextErrorProps, NextPageProps, NextSearchParams };
