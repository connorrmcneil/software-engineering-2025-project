import {Box, Container, Text, Title} from '@mantine/core'

/**
 * Facts & Question page for Asukom
 *
 * @Author Connor Gerrard - 2025
 */
export function FAQ() {
  return (
    <Box bg="gray.3" mih="100vh">
      <Container p={20} size="md">
        <Title order={1} c="blue.6">
          Frequently Asked Questions
        </Title>

        <Title order={2} pt={20} pb={20} fw={600} fs="italic" c="blue.6">
          How do I add words as administrator
        </Title>
        <Text size="md" mb={8}>
          Follow these steps to add, edit, or remove words from the application using the admin interface.
        </Text>
        <Text size="md" mb={6}>
          <strong>1. Sign in</strong>: Open the admin sign-in through the admin page button and enter your admin
          credentials.
        </Text>
        <Text size="md" mb={6}>
          <strong>2. Open the Add Word modal</strong>: On the admin page click the <em>Add word</em> button in the
          top-right to open the word creation modal.
        </Text>
        <Text size="md" mb={6}>
          <strong>3. Complete the form</strong>: Fill in the fields:
          <br />• <code>Mi'kmaq</code> — the word in Mi'kmaq
          <br />• <code>English</code> — the English translation
          <br />• <code>Starts in</code> — month that the word appears in game modes (select)
          <br />• <code>Image</code> — upload an image file for the word (required to be PNG/JPEG)
          <br />• <code>Audio</code> — upload an audio file for the word (required to be MP3)
        </Text>
        <Text size="md" mb={6}>
          <strong>4. Save the word</strong>: Click <em>Add word</em> in the modal. On success the modal will close, the
          word list will refresh, and the new word will appear in the table.
        </Text>
        <Text size="md" mb={6}>
          <strong>5. Edit or delete</strong>: Use the action menu (three dots) on a row to edit or delete a word.
          Editing opens a modal similar to the create form. Deleting requires confirmation — check the confirmation box
          and click <em>Delete word</em> to permanently remove it.
        </Text>
        <Text size="md">
          <strong>Note</strong>: All changes made via the admin page update the connected database and media storage
        </Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          What is Asukom?
        </Title>
        <Text size="md">
          Asukom is a Mi'kmaq language learning app designed to help users learn vocabulary through a dictionary feature
          and interactive educational games.
        </Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          Do I need an account to use Asukom?
        </Title>
        <Text size="md">No. All features of Asukom are fully available without creating an account or logging in.</Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          Are there ads or third-party trackers?
        </Title>
        <Text size="md">No. Asukom does not use ads, analytics tools, or any third-party tracking mechanisms.</Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          How accurate are the Mi'kmaq translations?
        </Title>
        <Text size="md">
          All vocabulary is sourced from verified Mi'kmaq language resources. Some variations may exist depending on
          dialect and community.
        </Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          Do the games save my progress?
        </Title>
        <Text size="md">No. The games are simple learning tools and do not store or track progress.</Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          Is Asukom free to use?
        </Title>
        <Text size="md">Yes. All features of Asukom are available for free.</Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          Who is this app intended for?
        </Title>
        <Text size="md">
          Asukom is for anyone interested in learning or practicing Mi'kmaq vocabulary, regardless of age or skill
          level.
        </Text>

        <Title order={2} pt={40} pb={20} fw={600} fs="italic" c="blue.6">
          Why is there an admin login page?
        </Title>
        <Text size="md">
          The admin page is used only by authorized maintainers to update word lists and manage content. Regular users
          do not need to access it.
        </Text>
      </Container>
    </Box>
  )
}
