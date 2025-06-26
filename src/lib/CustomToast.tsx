// utils/customToast.tsx
import toast from 'react-hot-toast';

interface NotificationPayload {
    notification?: {
        title?: string;
        body?: string;
    };
    data?: any;
}

interface CustomToastOptions {
    title?: string;
    body?: string;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    logoUrl?: string;
    onView?: () => void;
    showViewButton?: boolean;
    type?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const showCustomNotificationToast = (
    payload: NotificationPayload | CustomToastOptions, 
    options?: Partial<CustomToastOptions>
) => {
    // Handle both Firebase payload format and direct options
    const title = (payload as NotificationPayload).notification?.title || 
                    (payload as CustomToastOptions).title || 
                    options?.title || 
                    'Guardian Grove';
                    
    const body = (payload as NotificationPayload).notification?.body || 
                (payload as CustomToastOptions).body || 
                options?.body || 
                'You have a new notification';

    const duration = options?.duration || (payload as CustomToastOptions).duration || 5000;
    const position = options?.position || (payload as CustomToastOptions).position || 'top-right';
    const logoUrl = options?.logoUrl || (payload as CustomToastOptions).logoUrl || '/assets/logo/GuardianGrove_logo_NoText.png';
    const showViewButton = options?.showViewButton ?? (payload as CustomToastOptions).showViewButton ?? true;
    const toastType = options?.type || (payload as CustomToastOptions).type || 'default';

    // Get theme colors based on type
    const getThemeColors = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    gradient: 'from-green-400 via-emerald-500 to-teal-500',
                    iconBg: 'from-green-400 to-emerald-600',
                    buttonBg: 'bg-green-50 hover:bg-green-100',
                    buttonIcon: 'text-green-600 group-hover:text-green-700',
                    glow: 'from-green-400/10 to-emerald-500/10',
                    indicator: 'bg-green-400'
                };
            case 'error':
                return {
                    gradient: 'from-red-400 via-rose-500 to-pink-500',
                    iconBg: 'from-red-400 to-rose-600',
                    buttonBg: 'bg-red-50 hover:bg-red-100',
                    buttonIcon: 'text-red-600 group-hover:text-red-700',
                    glow: 'from-red-400/10 to-rose-500/10',
                    indicator: 'bg-red-400'
                };
            case 'warning':
                return {
                    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
                    iconBg: 'from-amber-400 to-orange-600',
                    buttonBg: 'bg-amber-50 hover:bg-amber-100',
                    buttonIcon: 'text-amber-600 group-hover:text-amber-700',
                    glow: 'from-amber-400/10 to-orange-500/10',
                    indicator: 'bg-amber-400'
                };
            case 'info':
                return {
                    gradient: 'from-blue-400 via-cyan-500 to-sky-500',
                    iconBg: 'from-blue-400 to-cyan-600',
                    buttonBg: 'bg-blue-50 hover:bg-blue-100',
                    buttonIcon: 'text-blue-600 group-hover:text-blue-700',
                    glow: 'from-blue-400/10 to-cyan-500/10',
                    indicator: 'bg-blue-400'
                };
            default:
                return {
                    gradient: 'from-emerald-400 via-green-500 to-teal-500',
                    iconBg: 'from-emerald-400 to-green-600',
                    buttonBg: 'bg-emerald-50 hover:bg-emerald-100',
                    buttonIcon: 'text-emerald-600 group-hover:text-emerald-700',
                    glow: 'from-emerald-400/10 to-green-500/10',
                    indicator: 'bg-emerald-400'
                };
        }
    };

    const colors = getThemeColors(toastType);
    
    toast.custom((t) => (
        <div
            className={`${
                t.visible ? 'toast-enter' : 'toast-leave'
            } relative max-w-sm w-full bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl pointer-events-auto overflow-hidden transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-3xl border border-white/20 toast-container`}
            style={{
                animation: t.visible 
                    ? 'toastSlideIn 1.2s cubic-bezier(0.16, 1, 0.3, 1)' 
                    : 'toastSlideOut 0.8s cubic-bezier(0.4, 0, 1, 1)'
            }}
        >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-20 animate-gradient-shift`}></div>
            
            {/* Progress Bar with Shimmer */}
            <div className="progress-container absolute top-0 left-0 w-full h-1 bg-gray-200/30 rounded-tl-2xl overflow-hidden">
                <div 
                    className={`progress-bar h-full bg-gradient-to-r ${colors.gradient} relative overflow-hidden`}
                    style={{
                        width: '100%',
                        animation: `progressShrink ${duration}ms linear forwards`,
                        transformOrigin: 'left center'
                    }}
                >
                    {/* Shimmer effect on progress bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex items-start p-5 space-x-4 relative z-10">
                {/* Animated Icon Container */}
                <div className="flex-shrink-0 mt-0.5">
                    <div className="relative h-14 w-14 flex items-center justify-center icon-bounce">
                        {/* Main icon container - removed background */}
                        <div className="relative h-12 w-12 flex items-center justify-center">
                            <img
                                className="h-10 w-10 object-contain filter drop-shadow-2xl"
                                src={logoUrl}
                                alt="Guardian Grove"
                                style={{
                                    background: 'transparent',
                                    mixBlendMode: 'normal',
                                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 8px rgba(0, 0, 0, 0.1))'
                                }}
                            />
                        </div>
                        
                        {/* Animated notification indicator */}
                        <div className={`absolute -top-1 -right-1 h-4 w-4 ${colors.indicator} rounded-full shadow-lg border-2 border-white animate-bounce-soft`}>
                            <div className={`absolute inset-0 ${colors.indicator} rounded-full animate-ping opacity-75`}></div>
                        </div>
                    </div>
                </div>
                
                {/* Text Content with Fade-in */}
                <div className="flex-1 min-w-0 pt-1 text-content-fade">
                    <p className="text-sm font-bold text-gray-900 mb-2 leading-tight animate-text-reveal">
                        {title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 animate-text-reveal-delay">
                        {body}
                    </p>
                </div>
                
                {/* Action Buttons with Staggered Animation */}
                <div className="flex items-center space-x-2 mt-1 buttons-stagger">
                    {/* View Button */}
                    {showViewButton && (
                        <button 
                            className={`group p-2 rounded-xl ${colors.buttonBg} transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg button-bounce-1`}
                            onClick={() => {
                                const onView = options?.onView || (payload as CustomToastOptions).onView;
                                if (onView) {
                                    onView();
                                } else {
                                    console.log('View notification clicked', payload);
                                }
                                toast.dismiss(t.id);
                            }}
                        >
                            <svg className={`h-4 w-4 ${colors.buttonIcon} transition-all duration-300 group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    )}
                    
                    {/* Close Button */}
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="group p-2 rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg button-bounce-2"
                    >
                        <svg className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>
    ), {
        duration,
        position,
    });
};

// Enhanced convenience functions with type-specific animations
export const showSuccessToast = (title: string, body: string, options?: Partial<CustomToastOptions>) => {
    showCustomNotificationToast({ title, body, type: 'success' }, options);
};

export const showErrorToast = (title: string, body: string, options?: Partial<CustomToastOptions>) => {
    showCustomNotificationToast({ title, body, type: 'error' }, {
        ...options,
        duration: 7000, // Longer duration for errors
    });
};

export const showWarningToast = (title: string, body: string, options?: Partial<CustomToastOptions>) => {
    showCustomNotificationToast({ title, body, type: 'warning' }, options);
};

export const showInfoToast = (title: string, body: string, options?: Partial<CustomToastOptions>) => {
    showCustomNotificationToast({ title, body, type: 'info' }, options);
};

// Firebase-specific helper
export const showFirebaseNotificationToast = (payload: NotificationPayload) => {
    showCustomNotificationToast(payload);
};