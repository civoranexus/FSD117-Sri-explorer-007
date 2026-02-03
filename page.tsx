import Link from "next/link"
import SignupForm from "@/components/auth/SignupForm"

export default function SignupPage() {
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                </p>
            </div>
            <SignupForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Sign in
                </Link>
            </p>
        </>
    )
}
