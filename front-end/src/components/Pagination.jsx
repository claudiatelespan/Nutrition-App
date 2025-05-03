export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);
  
    return (
      <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() =>onPageChange(currentPage - 1) }
          disabled={currentPage === 1}
          className="px-2 py-0.5 mr-10 border rounded-2xl disabled:opacity-50 cursor-pointer"
        >
          ←
        </button>
  
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 rounded border ${
              num === currentPage ? "bg-[#f84525] text-white" : "bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}
  
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-0.5 ml-10 border rounded-2xl disabled:opacity-50 cursor-pointer"
        >
          →
        </button>
      </div>
    );
  }
  