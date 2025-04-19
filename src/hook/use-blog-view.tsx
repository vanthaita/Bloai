'use client';
import { api } from '@/trpc/react';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useBlogViews = (slug: string) => {
    const queryClient = useQueryClient(); 
    const { data: views, isLoading: isViewsLoading } = api.blog.getViews.useQuery(
        { slug },
        { enabled: !!slug }
    );
    
    const { mutate: incrementViews } = api.blog.viewCount.useMutation({
        onSuccess: (updatedViews) => {
            queryClient.setQueryData(['blog', 'getViews', { input: { slug } }], updatedViews);
        }
    });

    useEffect(() => {
        if (slug) {
            const sessionKey = `viewed-${slug}`;
            if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
                incrementViews({ slug });
                sessionStorage.setItem(sessionKey, 'true');
            }
        }
    }, [slug, incrementViews]);

    return {
        views,
        isLoading: isViewsLoading,
    };
};