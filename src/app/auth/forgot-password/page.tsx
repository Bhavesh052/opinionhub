import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Suspense } from "react";

const ForgotPasswordPage = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Suspense fallback={<div>Loading...</div>}>
                <ForgotPasswordForm />
            </Suspense>
        </div>
    );
}

export default ForgotPasswordPage;
