import React, { useState,useRef, useEffect } from 'react';
import './ImageContainer.css'; // Import the CSS file for styling
const ImageContainer = () => {
const [opacity, setOpacity] = useState(0.5);
const [isDrawing, setIsDrawing] = useState(false);
const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
const canvasRef = useRef(null);
const imageRef = useRef(null);
const drawingRef = useRef([]); 
useEffect(() => {
  // Get the dimensions of the superimposed container and set the canvas width
  const superimposedContainer = document.querySelector('.superimposed-container');
  if (superimposedContainer) {
    const containerWidth = superimposedContainer.clientWidth;
    setCanvasWidth(containerWidth);
  }
}, []);

useEffect(() => {
  // Calculate the canvas height once the image is loaded
  const image = imageRef.current;
  if (image && canvasWidth) {
    image.onload = () => {
      const scaleFactor = canvasWidth / image.naturalWidth;
      const containerHeight = image.naturalHeight * scaleFactor;
      setCanvasHeight(containerHeight);
    };
  }
}, [canvasWidth]);

// useEffect(() => {
//   // Get the dimensions of the superimposed container and the original image
//   const superimposedContainer = document.querySelector('.superimposed-container');
//   const image = imageRef.current;
//   if (superimposedContainer && image) {
//     const containerWidth = superimposedContainer.clientWidth;
//     const imageWidth = image.width;
//     const scaleFactor = containerWidth / imageWidth;
//     const containerHeight = image.height * scaleFactor;
//     setCanvasWidth(containerWidth);
//     setCanvasHeight(containerHeight);
//   }
// }, []);
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'black'; // Set the stroke color to white
  ctx.scale(2, 2);
  ctx.lineWidth = 20; // Set the line width
}, []);

  // Event handler for adjusting the opacity
  const handleOpacityChange = (event) => {
    setOpacity(event.target.value);
  };
  const startDrawing = (event) => {
    console.log('Start drawing');
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 20;
    //const { offsetX, offsetY } = event.nativeEvent;
  const offsetX = event.clientX - rect.left; // Adjust mouse X coordinate
  const offsetY = event.clientY - rect.top;
    ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
    
  };
  const draw = (event) => {
    console.log('Drawing');
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    //const { offsetX, offsetY } = event.nativeEvent;
    const rect = canvas.getBoundingClientRect(); // Get the size of canvas and its position relative to the viewport
  const offsetX = event.clientX - rect.left; // Adjust mouse X coordinate
  const offsetY = event.clientY - rect.top; 
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.lineWidth = 20;
    if (drawingRef.current !== null) {
    const drawingPath = { x: offsetX, y: offsetY };
      //const drawingPath = { x: offsetX * (canvas.offsetWidth / canvas.width), y: offsetY * (canvas.offsetHeight / canvas.height) };
      drawingRef.current.push(drawingPath);
    
    }
  };

  const stopDrawing = () => {
    console.log(' Stop Drawing');
    setIsDrawing(false);
  };
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const image = imageRef.current;
    console.log('Canvas width:', canvas.width);
  console.log('Canvas height:', canvas.height);
  
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  //   console.log('New canvas width:', canvas.width);
  // console.log('New canvas height:', canvas.height);
  // Draw the original image on the canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  // Draw the drawing on the canvas
//   if (drawingRef.current.length > 0)
//   {
//   const drawingPath = drawingRef.current;
//   console.log('Drawing path:', drawingPath);
//   ctx.beginPath();
//   ctx.moveTo(drawingPath[0].x, drawingPath[0].y);
//   for (let i = 1; i < drawingPath.length; i++) {
//     ctx.lineTo(drawingPath[i].x, drawingPath[i].y);
//     ctx.stroke();
//   }
// }

  // Draw the drawing on the canvas using white color
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.lineWidth = 20;
  drawingRef.current.forEach(({ x, y }, index) => {
    if (index === 0) {
      ctx.moveTo(x * (canvas.width / canvas.offsetWidth), y * (canvas.height / canvas.offsetHeight));
    } else {
     ctx.lineTo(x * (canvas.width / canvas.offsetWidth), y * (canvas.height / canvas.offsetHeight));
    }
  });
  ctx.stroke(); 
  // Draw the drawing on the canvas
    const dataUrl = canvas.toDataURL('image/png');
   
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'lolmodified_image.png'; // Set the filename for the downloaded image
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      {/* Container for side by side images */}
      <div className="side-by-side-container">
        <div className="image-wrapper">
          <img src="/D6.try.jpg" alt="Image 1" className="image" />
        </div>
        <div className="image-wrapper">
          <img ref={imageRef} src="/mask.jpeg" alt="Image 2" className="image" />
        </div>
      </div>
      {/* Container for superimposed image */}
      <div className="superimposed-container">
        {/* Superimposed image */}
        <div className="image-wrapper">
          <img src="/D6.try.jpg" alt="Image 1" className="image" />
          <img src="/mask.jpeg" alt="Image 2" className="image superimpose" />
          <canvas
            ref={canvasRef}
            className="image superimpose"
            style={{ opacity: opacity.toFixed(2) }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            width={canvasWidth}
            height={canvasHeight}
          />
        </div>
        {/* Slider for adjusting opacity */}
        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={handleOpacityChange}
            className="slider"
          />
          </div>
          {/* Button to download the modified image */}
        <div className="download-button">
          <button onClick={downloadImage}>Download</button>
        </div>
        
      </div>
    </div>
  );
  }

export default ImageContainer;