export declare const createAndSendOTP: (email: string) => Promise<void>;
export declare const verifyOTP: (email: string, otp: string) => Promise<boolean>;
