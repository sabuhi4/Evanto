import React from 'react';
import { Dialog, DialogProps } from '@mui/material';
import { useUserStore } from '@/store/userStore';

interface ContainerDialogProps extends Omit<DialogProps, 'sx'> {
    children: React.ReactNode;
}

export const ContainerDialog: React.FC<ContainerDialogProps> = ({
    children,
    PaperProps,
    ...dialogProps
}) => {
    const isDarkMode = useUserStore(state => state.isDarkMode);

    return (
        <Dialog
            {...dialogProps}
            disablePortal={true}
            className="fixed inset-0 z-[1300]"
            BackdropProps={{
                className: 'bg-black/50'
            }}
            PaperProps={{
                className: `rounded-2xl m-4 max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] w-full ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`,
                ...PaperProps,
            }}
        >
            {children}
        </Dialog>
    );
};

