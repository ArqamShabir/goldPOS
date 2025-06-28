import React from 'react';
import jsPDF from 'jspdf';

const PrintTagButton = ({ product }) => {
  const printTag = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [32, 32], // Tag size
    });

    doc.setFontSize(10);
    doc.text(`${product.karat} | ${product.weight}`, 5, 15);
    doc.text(`PKR ${product.price}`, 5, 20);

    doc.save(`${product.name}-tag.pdf`);
  };

  return (
    <button onClick={printTag}>
      Print Tag
    </button>
  );
};

export default PrintTagButton;
