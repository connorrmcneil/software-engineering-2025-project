/**
 * Sign-in page for user authentication.
 *
 * @author Sean MacDougall
 */

import {BackgroundImage, Button, Center, Paper, PasswordInput, Text, TextInput} from '@mantine/core'
import {isNotEmpty, useForm} from '@mantine/form'
import {ArrowLeftIcon} from '@phosphor-icons/react'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router'

import {api} from '@/api'

export function SigninPage() {
  // signin form with username and password fields
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: ''
    },
    validate: {
      username: isNotEmpty('Username is required'),
      password: isNotEmpty('Password is required')
    }
  })

  const [failed, setFailed] = useState<boolean>(false)

  const navigate = useNavigate()

  const onSubmit = async (values: typeof form.values) => {
    // try to sign in with the provided username and password
    try {
      const {data} = await api.post('/auth', values)
      // if successful, store the returned token and navigate to the admin page
      localStorage.setItem('AuthToken', data.token)
      await navigate('/admin')
    } catch {
      // if sign-in fails, show an error message
      setFailed(true)
    }
  }

  return (
    <BackgroundImage src="/goat-island.jpg" h="100vh">
      <Center pt={150}>
        <Paper withBorder shadow="sm" p="lg" w={500}>
          <Text size="lg" fw="bold" ta="center">
            Welcome back!
          </Text>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
              label="Username"
              placeholder="Enter your username"
              withAsterisk
              key={form.key('username')}
              {...form.getInputProps('username')}
              mb="sm"
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              withAsterisk
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            {/* button is type=submit so that the form submits when clicked */}
            <Button type="submit" fullWidth mt="xl" mb="md" radius="md">
              Sign in
            </Button>
            <Button variant="default" fullWidth component={Link} to="/" leftSection={<ArrowLeftIcon size={16} />}>
              Back to app
            </Button>
          </form>
          {failed && (
            <Text c="red" size="sm" mt="md" ta="center">
              Invalid username or password
            </Text>
          )}
        </Paper>
      </Center>
    </BackgroundImage>
  )
}
