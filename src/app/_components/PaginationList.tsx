import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationListProps {
  /** Current active page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page is changed */
  onPageChange: (page: number) => void;
  /** Number of siblings to show on each side of current page */
  siblingsCount?: number;
  /** Number of pages to show at the beginning and end */
  boundaryCount?: number;
}

/**
 * PaginationList component that handles pagination with large numbers of pages
 */
const PaginationList: React.FC<PaginationListProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
  boundaryCount = 1,
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Ensure current page is valid
  const page = Math.max(1, Math.min(currentPage, totalPages));

  // Handler for page change
  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  // Calculate the range of pages to show
  const range = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const generatePages = (): React.ReactNode[] => {
    // Calculate the start and end points for the sibling pages
    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(
      Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
      totalPages,
    );

    const siblingStart = Math.max(
      Math.min(
        page - siblingsCount,
        totalPages - siblingsCount - boundaryCount - 1,
      ),
      boundaryCount + 1,
    );

    const siblingEnd = Math.min(
      Math.max(page + siblingsCount, boundaryCount + siblingsCount + 2),
      endPages.length > 0 ? endPages[0]! - 1 : totalPages,
    );

    // Determine if we need ellipses
    const showStartEllipsis = siblingStart > boundaryCount + 1;
    const showEndEllipsis = siblingEnd < totalPages - boundaryCount;

    const itemList: React.ReactNode[] = [];

    // Add start pages
    startPages.forEach((pageNumber) => {
      itemList.push(
        <PaginationItem key={`page-${pageNumber}`}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(pageNumber);
            }}
            isActive={page === pageNumber}
          >
            {pageNumber}
          </PaginationLink>
        </PaginationItem>,
      );
    });

    // Add start ellipsis if needed
    if (showStartEllipsis) {
      itemList.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Add sibling pages
    range(siblingStart, siblingEnd).forEach((pageNumber) => {
      if (
        pageNumber > boundaryCount &&
        pageNumber < totalPages - boundaryCount + 1
      ) {
        itemList.push(
          <PaginationItem key={`page-${pageNumber}`}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNumber);
              }}
              isActive={page === pageNumber}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    });

    // Add end ellipsis if needed
    if (showEndEllipsis) {
      itemList.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Add end pages
    endPages.forEach((pageNumber) => {
      if (pageNumber > boundaryCount) {
        itemList.push(
          <PaginationItem key={`page-${pageNumber}`}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNumber);
              }}
              isActive={page === pageNumber}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    });

    return itemList;
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page - 1);
            }}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {generatePages()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page + 1);
            }}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationList;
