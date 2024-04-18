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


useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'white'; // Set the stroke color to white
  ctx.scale(2, 2);
  ctx.lineWidth = 10; 
  ctx.shadowBlur = 5;// Set the line width
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
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFFFFF';

    ctx.shadowBlur = 5;
    const offsetX = 2*(event.clientX - rect.left); // Adjust mouse X coordinate
    const offsetY = 2*(event.clientY - rect.top);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    drawingRef.current.push([{ x: offsetX, y: offsetY }]);
    
  };
  const draw = (event) => {
    console.log('Drawing');
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect(); // Get the size of canvas and its position relative to the viewport
    ctx.strokeStyle = '#FFFFFF';
    const offsetX = 2*(event.clientX - rect.left); // Adjust mouse X coordinate
    const offsetY = 2*(event.clientY - rect.top); 
    
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.lineWidth = 10;
    
    drawingRef.current[drawingRef.current.length - 1].push({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    console.log(' Stop Drawing');
    setIsDrawing(false);
  };
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowBlur = 10;
  // Draw the original image on the canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
 

  // Draw the drawing on the canvas using white color
    ctx.strokeStyle = 'white';
    //ctx.beginPath();
    ctx.lineWidth = 10;

drawingRef.current.forEach(path => {
    if (path.length) {
        ctx.beginPath(); // Start a new path
        // Scale the coordinates according to the canvas size
        ctx.moveTo(path[0].x *0.5* (canvas.width / canvas.offsetWidth), path[0].y *0.5* (canvas.height / canvas.offsetHeight));
        path.forEach((point, index) => {
            if (index > 0) {
                ctx.lineTo(point.x*0.5 * (canvas.width / canvas.offsetWidth), point.y *0.5 * (canvas.height / canvas.offsetHeight));
            }
        });
        ctx.stroke(); // Apply the stroke to the path
    }
});

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