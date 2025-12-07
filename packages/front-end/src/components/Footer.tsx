import { Anchor, Container, Group, Text } from '@mantine/core'
import { FeatherIcon } from '@phosphor-icons/react'

import classes from '@/styles/FooterStyle.module.css'

const links = [
  { link: '/faq', label: 'Frequently Asked Questions' },
  { link: '/privacypolicy', label: 'Privacy Policy' },
  { link: '/admin', label: 'Nikana\'tu\'tite\'wk' }
]

export function Footer() {
  const items = links.map(link => (
    <Anchor<'a'> c="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ))

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group gap="sm">
          <FeatherIcon size="32" weight="duotone" color="var(--mantine-color-yellow-6)" />
          <Text fw="bold" size="lg" fs="italic">
            Mikwite'tmk+t Angie
          </Text>
        </Group>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  )
}
