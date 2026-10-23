import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button, Input } from '@/reusable'
import { loginSchema, type LoginFormValues } from './loginValidation'

const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'admin123'
const AUTH_TOKEN = 'asjklj30-3223kjd-4j3-23kjasd'

export function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function onSubmit(values: LoginFormValues) {
    clearErrors('root')

    if (values.username.trim() !== DEMO_USERNAME || values.password !== DEMO_PASSWORD) {
      setError('root', { message: 'Invalid username or password.' })
      return
    }

    login(AUTH_TOKEN)
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
