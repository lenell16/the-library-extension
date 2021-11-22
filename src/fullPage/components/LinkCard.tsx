import { Card, Overlay, Text, Image } from '@mantine/core';

// const useStyles = createUseStyles(
//   () => ({
//     title: {
//       display: 'box',
//       boxOrient: 'vertical',
//       lineClamp: 3,
//       overflow: 'hidden',
//     },
//   }),
//   { theming }
// );

interface Props {
  url: string | null;
  title: string | null;
}

export default function LinkCard({ url, title }: Props) {
  // const classes = useStyles();

  return (
    <Card shadow="sm" padding="sm" style={{ width: '100%' }}>
      <Text
        weight={500}
        // className={classes.title}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: 5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5
        }}
        weight={500}
        size="xs"
      >
        {url && (
          <>
            <Image
              width={16}
              height={16}
              src={`https://api.faviconkit.com/${new URL(url).hostname}/144`}
            />{' '}
            ({new URL(url).hostname})
          </>
        )}
      </Text>

      {url && <Overlay opacity={0} component="a" href={url} target="_blank" />}
    </Card>
  );
}
