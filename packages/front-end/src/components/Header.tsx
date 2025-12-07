import { Burger, Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, useLocation } from 'react-router'

import classes from '@/styles/HeaderStyle.module.css'
import { Dictionary } from './Dictionary'

const links = [
  { link: '/', label: 'Apaja\'si Nikantuk' },
  { link: '/matching-game', label: 'Klusuwaqnminal' },
  { link: '/eskasoni-island-game', label: 'Te\'puljwe\'kati Waisisk' },
  { link: '/admin', label: 'Nikana\'tu\'tite\'wk' }
]

export function Header() {
  const location = useLocation()
  const [opened, { toggle }] = useDisclosure(false)

  const items = links.map(link => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={location.pathname === link.link || undefined}
    >
      {link.label}
    </Link>
  ))
  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Group gap={7} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        <Dictionary />
      </Container>
    </header>
  )
}
