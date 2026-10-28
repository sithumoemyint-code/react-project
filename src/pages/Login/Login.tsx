import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button, Input } from '@/reusable'
import { loginFunction } from './LoginUtils'
import { Navigate } from 'react-router-dom';

export function Login() {
  const { control, handleSubmit, onSubmit, errors, isAuthenticated } = loginFunction();
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-full items-center justify-center bg-[linear-gradient(180deg,#f8f9fb_0%,#ffffff_55%,#f3f5f8_100%)] p-6">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-[1.35rem] font-semibold tracking-tight">
            Mytel for Developers
          </CardTitle>
          <CardDescription>CMS Administration</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <Input
              control={control}
              name="username"
              label="Username"
              type="text"
              autoComplete="username"
              placeholder="Enter username"
            />
            <Input
              control={control}
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
            />

            {errors.root?.message ? (
              <p className="m-0 text-xs text-destructive">{errors.root.message}</p>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-0 bg-transparent">
            <Button>Sign in</Button>
            <p className="m-0 text-center text-[0.8rem] text-muted-foreground">
              Demo: admin / admin123
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
