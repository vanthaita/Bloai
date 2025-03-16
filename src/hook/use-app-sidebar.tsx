"use client";

import { useState, useEffect, useRef } from 'react';

export const useOpenAppSidebar = () => {
    const [isOpenAppSidebar, setIsOpenAppSidebar] = useState(false);
    return {
        isOpenAppSidebar,
        setIsOpenAppSidebar
    }
};