import { loginSchema, type LoginFormValues } from './loginValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'admin123'
const AUTH_TOKEN = 'asjklj30-3223kjd-4j3-23kjasd'

const loginFunction = () => {
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

  const onSubmit = (values: LoginFormValues) => {
    clearErrors('root')

    if (values.username.trim() !== DEMO_USERNAME || values.password !== DEMO_PASSWORD) {
      setError('root', { message: 'Invalid username or password.' })
      return
    }

    login(AUTH_TOKEN)
    navigate('/', { replace: true })
  }

  return {onSubmit , control, handleSubmit, errors, isAuthenticated  }
}

export { loginFunction }