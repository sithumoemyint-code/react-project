import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const result = login(username, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[linear-gradient(180deg,#f8f9fb_0%,#ffffff_55%,#f3f5f8_100%)] p-6">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-[1.35rem] font-semibold tracking-tight">
            Mytel for Developers
          </CardTitle>
          <CardDescription>CMS Administration</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-10"
              />
            </div>

            {error ? <p className="m-0 text-sm text-destructive">{error}</p> : null}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-0 bg-transparent">
            <Button type="submit" size="lg" className="h-10 w-full">
              Sign in
            </Button>
            <p className="m-0 text-center text-[0.8rem] text-muted-foreground">
              Demo: admin / admin123
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
