import { useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  totalPages: number;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Paginacion = ({
  totalPages,
  currentPage: externalPage,
  totalItems = 0,
  itemsPerPage = 5,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Usar página del prop o de la URL
  const queryPage =
    externalPage !== undefined
      ? externalPage.toString()
      : searchParams.get("page") || "1";

  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  // Calcular información de rango
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Información de rango */}
      {totalItems > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {startItem} a {endItem} de {totalItems} clientes
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {/* Solo mostrar primeras, últimas y páginas cercanas */}
        {page > 3 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {page > 4 && <span className="px-2">...</span>}
          </>
        )}

        {/* Páginas alrededor de la actual */}
        {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = index + 1;
          } else if (page <= 3) {
            pageNumber = index + 1;
          } else if (page >= totalPages - 2) {
            pageNumber = totalPages - 4 + index;
          } else {
            pageNumber = page - 2 + index;
          }

          if (pageNumber < 1 || pageNumber > totalPages) return null;

          return (
            <Button
              key={pageNumber}
              variant={page === pageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}

        {page < totalPages - 2 && (
          <>
            {page < totalPages - 3 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
