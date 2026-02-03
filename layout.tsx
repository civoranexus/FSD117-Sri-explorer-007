import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthLayoutWrapper>
            {children}
        </AuthLayoutWrapper>
    )
}
