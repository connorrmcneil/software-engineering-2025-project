import { Burger, Container, Group, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, useLocation } from 'react-router'

import classes from '@/styles/HeaderStyle.module.css'
import { Dictionary } from './Dictionary'

const links = [
  { link: '/', mikmaq: 'Apaja\'si Nikantuk', english: 'Home' },
  { link: '/matching-game', mikmaq: 'Klusuwaqnminal', english: 'Word Match' },
  { link: '/eskasoni-island-game', mikmaq: 'Te\'puljwe\'kati Waisisk', english: 'Goat Island Animals' },
  { link: '/admin', mikmaq: 'Nikana\'tu\'tite\'wk', english: 'Admin' }
]

export function Header() {
  const location = useLocation()
  const [opened, { toggle }] = useDisclosure(false)

  const items = links.map(link => (
    <Link
      key={link.mikmaq}
      to={link.link}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
    >
      <Stack gap={0} align="center">
        <Text span>{link.mikmaq}</Text>
        <Text span size="12px" style={{ opacity: 0.8 }}>{link.english}</Text>
      </Stack>

    </Link>
  ))
  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Group gap={8} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        <Dictionary />
      </Container>
    </header>
  )
}