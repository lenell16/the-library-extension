import { Box } from 'atomic-layout';
import { usePaginationFragment, graphql } from 'react-relay';
import { LinkList_connection$key } from './__generated__/LinkList_connection.graphql';
import * as R from 'ramda';

import {
  LinksPaginationQuery,
  LinksPaginationQueryVariables
} from './__generated__/LinksPaginationQuery.graphql';
import LinkCard from './LinkCard';
import { useEffect, useRef, useCallback } from 'react';
import { useVirtual } from 'react-virtual';

interface Props extends LinksPaginationQueryVariables {
  linkConnection: LinkList_connection$key;
}

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export default function LinkList({ linkConnection, filter, count }: Props) {
  const {
    data,
    loadNext,
    hasNext,
    refetch,
    isLoadingNext
  } = usePaginationFragment<LinksPaginationQuery, LinkList_connection$key>(
    graphql`
      fragment LinkList_connection on query_root
        @argumentDefinitions(
          cursor: { type: "String" }
          count: { type: "Int", defaultValue: 100 }
          filter: {
            type: "Link_bool_exp"
            defaultValue: { incognito: { _eq: false } }
          }
        )
        @refetchable(queryName: "LinksPaginationQuery") {
        Link_connection(
          after: $cursor
          first: $count
          order_by: { createdAt: desc }
          where: $filter
        ) @connection(key: "linkList_Link_connection") {
          edges {
            node {
              id
              incognito
              title
              updatedAt
              url
              createdAt
            }
          }
        }
      }
    `,
    linkConnection
  );
  const elRef = useRef<HTMLDivElement>(null);

  const scrollingRef = useRef();

  const scrollToFn = useCallback((offset, defaultScrollTo) => {
    const duration = 1000;
    const start = (elRef.current as HTMLDivElement).scrollTop;
    // @ts-ignore
    const startTime = (scrollingRef.current = Date.now());

    const run = () => {
      if (scrollingRef.current !== startTime) return;
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
      const interpolated = start + (offset - start) * progress;

      if (elapsed < duration) {
        defaultScrollTo(interpolated);
        requestAnimationFrame(run);
      } else {
        defaultScrollTo(interpolated);
      }
    };

    requestAnimationFrame(run);
  }, []);

  const rowVirtualizer = useVirtual({
    size: data.Link_connection.edges.length,
    parentRef: elRef,
    estimateSize: useCallback(() => 100, []),
    overscan: 15,
    scrollToFn
  });

  const defaultCount = count ?? 150;

  useEffect(() => {
    const lastItem = R.last(rowVirtualizer.virtualItems);

    if (!lastItem) {
      return;
    }
    if (
      lastItem.index >= data.Link_connection.edges.length - 25 &&
      hasNext &&
      !isLoadingNext
    ) {
      loadNext(defaultCount);
    }
  }, [
    hasNext,
    loadNext,
    data.Link_connection.edges.length,
    isLoadingNext,
    rowVirtualizer.virtualItems,
    defaultCount
  ]);

  useEffect(() => {
    refetch({ filter });
    rowVirtualizer.scrollToOffset(0);
  }, [rowVirtualizer.scrollToOffset, filter, refetch]);

  return (
    <Box
      ref={elRef}
      style={{
        width: `100%`,
        overflowX: 'scroll'
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.virtualItems.map(virtualRow => {
          const link = data.Link_connection.edges[virtualRow.index].node;
          return (
            <div
              key={virtualRow.index}
              ref={virtualRow.measureRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: 16
              }}
            >
              <LinkCard key={link.id} url={link.url} title={link.title} />
            </div>
          );
        })}
      </div>
    </Box>
  );
}
