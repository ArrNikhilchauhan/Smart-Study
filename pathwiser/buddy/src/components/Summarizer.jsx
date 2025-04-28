import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfLib from 'pdf-lib';
import pdfParse from 'pdf-parse';
import * as d3 from 'd3';
import * as cloud from 'd3-cloud';

function PdfCompressor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError(null);
    } else {
      setError('Please upload a valid PDF file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const processPdf = async () => {
    if (!pdfFile) return;
    setProcessing(true);
    setError(null);

    try {
      // Read the PDF file
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);

      // Extract text using pdf-parse
      const pdf = await pdfParse(pdfData);
      const text = pdf.text;

      // Basic text processing (word frequency)
      const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 3);
      const wordFreq = {};
      words.forEach((word) => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      // Create a word cloud visualization with D3
      const svgWidth = 400;
      const svgHeight = 300;
      const wordsForCloud = sortedWords.map(([word, freq]) => ({
        text: word,
        size: 10 + freq * 5,
      }));

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', svgWidth);
      svg.setAttribute('height', svgHeight);

      await new Promise((resolve) => {
        cloud()
          .size([svgWidth, svgHeight])
          .words(wordsForCloud)
          .padding(5)
          .rotate(() => ~~(Math.random() * 2) * 90)
          .fontSize((d) => d.size)
          .on('end', (words) => {
            d3.select(svg)
              .append('g')
              .attr('transform', `translate(${svgWidth / 2},${svgHeight / 2})`)
              .selectAll('text')
              .data(words)
              .enter()
              .append('text')
              .style('font-size', (d) => `${d.size}px`)
              .style('fill', () =>
                d3.schemeCategory10[Math.floor(Math.random() * 10)]
              )
              .attr('text-anchor', 'middle')
              .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
              .text((d) => d.text);
            resolve();
          })
          .start();
      });

      // Convert SVG to PNG
      const svgString = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = svgWidth;
      canvas.height = svgHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');

      // Create a new PDF using pdf-lib
      const pdfDoc = await pdfLib.PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { width, height } = page.getSize();

      // Add title
      const font = await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);
      page.drawText('Compact Notes Summary', {
        x: 50,
        y: height - 50,
        size: 20,
        font,
      });

      // Add summarized text
      const summary = `Summary of Notes:\nKey terms: ${sortedWords
        .map(([word, freq]) => `${word} (${freq})`)
        .join(', ')}`;
      page.drawText(summary, {
        x: 50,
        y: height - 100,
        size: 12,
        font,
        maxWidth: width - 100,
      });

      // Embed the word cloud image
      const imgBytes = await fetch(imgData).then((res) => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(imgBytes);
      page.drawImage(pngImage, {
        x: 50,
        y: height - 350,
        width: 200,
        height: 150,
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError('Error processing PDF: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">PDF Notes Compressor</h1>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 mb-4 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop a PDF file here, or click to select</p>
        {pdfFile && <p className="mt-2 text-sm">Selected: {pdfFile.name}</p>}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={processPdf}
        disabled={!pdfFile || processing}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : 'Generate Compact PDF'}
      </button>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="compact_notes.pdf"
          className="block mt-4 text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Download Compact PDF
        </a>
      )}
    </div>
  );
}

export default PdfCompressor;