import { Divider } from '@mantine/core';
import { Box } from 'atomic-layout';
import { Archive, Layout, Inbox, Home } from '@styled-icons/feather';
import { routes } from '../router';

export default function Navigation() {
  return (
    <>
      <Box
        as="a"
        {...routes.unsorted().link}
        padding={12}
        flex
        alignItems="center"
      >
        <Inbox size={24} strokeWidth={2} style={{ marginRight: 8 }} />
        Unsorted
      </Box>
      <Box
        as="a"
        {...routes.allTabs().link}
        padding={12}
        flex
        alignItems="center"
      >
        <Home size={24} strokeWidth={2} style={{ marginRight: 8 }} />
        All Tabs
      </Box>
      <Box
        as="a"
        {...routes.windows().link}
        padding={12}
        flex
        alignItems="center"
      >
        <Layout size={24} strokeWidth={2} style={{ marginRight: 8 }} />
        Windows
      </Box>
      <Box
        as="a"
        {...routes.archive().link}
        padding={12}
        flex
        alignItems="center"
      >
        <Archive size={24} strokeWidth={2} style={{ marginRight: 8 }} />
        Archive
      </Box>
      <Divider />
    </>
  );
}
