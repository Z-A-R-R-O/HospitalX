import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  
  if (!clerkEnabled) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
        <h2>Authentication is disabled.</h2>
        <p>No NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY provided.</p>
        <a href="/health-worker" style={{ color: 'var(--blue)' }}>Go to Health Worker App</a>
      </div>
    );
  }

  return <SignIn />;
}
