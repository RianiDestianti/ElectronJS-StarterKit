import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePageLoaderOptions {
    delay?: number;
}

export function usePageLoader(options: UsePageLoaderOptions = {}) {
    const { delay = 250 } = options;
    const [isPageLoading, setIsPageLoading] = useState(false);
    const pendingRequests = useRef(0);
    const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current);
            }
        };
    }, []);

    const startLoading = useCallback(() => {
        if (hideTimeout.current) {
            clearTimeout(hideTimeout.current);
            hideTimeout.current = null;
        }

        if (pendingRequests.current === 0) {
            setIsPageLoading(true);
        }

        pendingRequests.current += 1;
    }, []);

    const stopLoading = useCallback(() => {
        pendingRequests.current = Math.max(0, pendingRequests.current - 1);

        if (pendingRequests.current === 0) {
            hideTimeout.current = setTimeout(() => {
                setIsPageLoading(false);
                hideTimeout.current = null;
            }, delay);
        }
    }, [delay]);

    const runWithLoader = useCallback(
        async <Result,>(task: () => Promise<Result> | Result): Promise<Result> => {
            startLoading();
            try {
                return await task();
            } finally {
                stopLoading();
            }
        },
        [startLoading, stopLoading]
    );

    return { isPageLoading, runWithLoader };
}
