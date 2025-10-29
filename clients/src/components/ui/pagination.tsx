import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxPagesToShow = 5;
  const halfRange = Math.floor(maxPagesToShow / 2);

  let startPage = Math.max(currentPage - halfRange, 1);
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-end items-right gap-1 mt-6 w-full">
      <Button
        onClick={() => onPageChange(1)}
        variant="outline"
        disabled={currentPage === 1}
        size="pagination"
      >
        Primeira
      </Button>

      <Button
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
        disabled={currentPage === 1}
        size="pagination"
      >
        ‹
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={
            page === currentPage ? "pagination-active" : "pagination-inactive"
          }
          size="pagination"
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
        disabled={currentPage === totalPages}
        size="pagination"
      >
        {"›"}
      </Button>
      <Button
        onClick={() => onPageChange(totalPages)}
        variant="outline"
        disabled={currentPage === totalPages}
        size="pagination"
      >
        Ultima
      </Button>
    </div>
  );
};

export default Pagination;
