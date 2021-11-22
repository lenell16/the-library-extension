import {
  Checkbox,
  Stack,
  Box,
  ChakraProvider,
  Button,
  ButtonGroup,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { useListState } from '@mantine/hooks';
import { isNil, isEmpty } from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const queryClient = new QueryClient();

interface CheckedTab extends chrome.tabs.Tab {
  checked: boolean;
}

interface CheckedWindow extends chrome.windows.Window {
  tabs: CheckedTab[];
}

interface PopupProps {
  windows: CheckedWindow[];
}

interface WindowProps {
  window: CheckedWindow;
  checkWindow: (isChecked: boolean) => void;
  checkTab: (tabIndex: number, isChecked: boolean) => void;
}

function removeCheckedTabsFromWindow(
  windows: CheckedWindow[]
): CheckedWindow[] {
  return windows
    .map(window => ({
      ...window,
      tabs: window.tabs!.filter(({ checked }) => !checked)
    }))
    .filter(({ tabs }) => !isNil(tabs) || !isEmpty(tabs));
}

function getAllCheckedTabs(windows: CheckedWindow[]): number[] {
  return windows
    .map(({ tabs }) => tabs)
    .flat(1)
    .filter(({ checked }) => checked)
    .map(({ id }) => id!);
}

function removeTabs(windows: CheckedWindow[]) {
  const tabIds = getAllCheckedTabs(windows);
  return chrome.tabs.remove(tabIds);
}

function getAllWindows() {
  return chrome.windows.getAll({ populate: true });
}

function Window({ checkTab, checkWindow, window }: WindowProps) {
  const allChecked = window.tabs?.every(value => value.checked);
  const indeterminate =
    window.tabs?.some(value => value.checked) && !allChecked;

  return (
    <Box borderWidth={1} borderRadius={12} padding={3}>
      <Checkbox
        fontSize="xs"
        colorScheme="teal"
        isChecked={allChecked}
        isIndeterminate={indeterminate}
        onChange={() => checkWindow(!allChecked)}
      >
        {window.id}
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        {window.tabs?.map((value, index) => (
          <Checkbox
            fontSize="xs"
            isTruncated
            colorScheme="teal"
            key={value.id}
            isChecked={value.checked}
            onChange={event => checkTab(index, event.currentTarget.checked)}
          >
            {value.title}
          </Checkbox>
        ))}
      </Stack>
    </Box>
  );
}

function Popup({ windows }: PopupProps) {
  console.log(windows);
  const [values, handlers] = useListState(windows);

  const allChecked = values.every(value =>
    value.tabs.every(tab => tab.checked)
  );
  const indeterminate =
    values.some(value => value.tabs.some(tab => tab.checked)) && !allChecked;
  return (
    <Box borderWidth={1} borderRadius={12} padding={3} margin={3}>
      <Flex align="center">
        <Checkbox
          fontSize="xs"
          colorScheme="teal"
          isChecked={allChecked}
          isIndeterminate={indeterminate}
          onChange={() =>
            handlers.setState(current =>
              current.map(value => ({
                ...value,
                tabs: value.tabs.map(tab => ({ ...tab, checked: !allChecked }))
              }))
            )
          }
        >
          {allChecked ? 'Unselect' : 'Select'} All
        </Checkbox>
        <Spacer />
        <Stack spacing={4} direction="row" align="center">
          <ButtonGroup
            colorScheme="teal"
            size="xs"
            isDisabled={!allChecked && !indeterminate}
          >
            <Button onClick={() => removeTabs(values)}>Close</Button>
            <Button>Save</Button>
            <Button>Save & Close</Button>
          </ButtonGroup>
        </Stack>
      </Flex>
      <Stack mt={3} spacing={3}>
        {values.map((window, windowIndex) => (
          <Window
            checkWindow={checked =>
              handlers.setItemProp(
                windowIndex,
                'tabs',
                window.tabs.map(tab => ({ ...tab, checked }))
              )
            }
            checkTab={(checkedTabIndex, checked) =>
              handlers.setItemProp(
                windowIndex,
                'tabs',
                window.tabs.map((tab, tabIndex) =>
                  tabIndex === checkedTabIndex ? { ...tab, checked } : tab
                )
              )
            }
            window={window}
          />
        ))}
      </Stack>
    </Box>
  );
}

function App() {
  const { isLoading, error, data } = useQuery('tabs', getAllWindows);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: {error?.message}</div>;

  if (isNil(data)) {
    return <div>No tabs</div>;
  }

  return (
    <Box width="md">
      <Popup
        windows={data.map(window => ({
          ...window,
          tabs: window.tabs!.map(tab => ({ ...tab, checked: true }))
        }))}
      />
    </Box>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
