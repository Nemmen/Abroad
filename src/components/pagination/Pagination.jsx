import React from 'react';
import {
  Button,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  MdChevronLeft, 
  MdChevronRight,
  MdFirstPage,
  MdLastPage
} from 'react-icons/md';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const buttonBg = useColorModeValue('white', 'navy.700');
  const buttonActiveBg = useColorModeValue('brand.500', 'brand.400');
  const buttonActiveColor = useColorModeValue('white', 'white');
  
  // Handle page navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // Show nothing if there's only 1 page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Flex align="center" justify="center" wrap="wrap" gap={1}>
      {/* First page button */}
      <IconButton
        aria-label="First page"
        icon={<MdFirstPage />}
        size="sm"
        variant="outline"
        onClick={() => goToPage(1)}
        isDisabled={currentPage === 1}
      />
      
      {/* Previous page button */}
      <IconButton
        aria-label="Previous page"
        icon={<MdChevronLeft />}
        size="sm"
        variant="outline"
        onClick={() => goToPage(currentPage - 1)}
        isDisabled={currentPage === 1}
      />
      
      {/* Page number buttons */}
      {getPageNumbers().map((pageNumber) => (
        <Button
          key={pageNumber}
          size="sm"
          variant={pageNumber === currentPage ? "solid" : "outline"}
          onClick={() => goToPage(pageNumber)}
          bg={pageNumber === currentPage ? buttonActiveBg : buttonBg}
          color={pageNumber === currentPage ? buttonActiveColor : undefined}
          _hover={{
            bg: pageNumber === currentPage ? buttonActiveBg : undefined,
          }}
        >
          {pageNumber}
        </Button>
      ))}
      
      {/* Next page button */}
      <IconButton
        aria-label="Next page"
        icon={<MdChevronRight />}
        size="sm"
        variant="outline"
        onClick={() => goToPage(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      />
      
      {/* Last page button */}
      <IconButton
        aria-label="Last page"
        icon={<MdLastPage />}
        size="sm"
        variant="outline"
        onClick={() => goToPage(totalPages)}
        isDisabled={currentPage === totalPages}
      />
      
      {/* Page info */}
      <Text ml={2} fontSize="sm" color="gray.500">
        Page {currentPage} of {totalPages}
      </Text>
    </Flex>
  );
}

export default Pagination;