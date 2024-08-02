// import React, { useRef, useState, useEffect } from 'react';

// const App: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const img = new Image();
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           img.src = e.target.result as string;
//           img.onload = () => setUploadedImage(img);
//         }
//       };
//       reader.readAsDataURL(event.target.files[0]);
//     }
//   };

//   const startDrawing = (e: React.MouseEvent) => {
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.strokeStyle = 'white'; // Use white for drawing the annotations
//         ctx.lineWidth = 4;
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//       }
//     }
//   };

//   const draw = (e: React.MouseEvent) => {
//     if (!isDrawing) return;
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//       }
//     }
//   };

//   const stopDrawing = () => {
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.closePath();
//       }
//     }
//     setIsDrawing(false);
//   };

//   const fillInsideBorder = (ctx: CanvasRenderingContext2D) => {
//     const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
//     const data = imageData.data;
//     const width = ctx.canvas.width;

//     const borderColor: [number, number, number, number] = [255, 255, 255, 255]; // white
//     const fillColor: [number, number, number, number] = [0, 0, 0, 255]; // black

//     const getPixel = (x: number, y: number): [number, number, number, number] => {
//       const index = (y * width + x) * 4;
//       return [data[index], data[index + 1], data[index + 2], data[index + 3]] as [number, number, number, number];
//     };

//     const setPixel = (x: number, y: number, color: [number, number, number, number]) => {
//       const index = (y * width + x) * 4;
//       data[index] = color[0];
//       data[index + 1] = color[1];
//       data[index + 2] = color[2];
//       data[index + 3] = color[3];
//     };

//     const colorToString = (color: [number, number, number, number]) =>
//       `${color[0]},${color[1]},${color[2]},${color[3]}`;

//     const borderColorString = colorToString(borderColor);
//     const fillColorString = colorToString(fillColor);

//     const floodFill = (x: number, y: number) => {
//       const stack: [number, number][] = [[x, y]];
//       const visited = new Set<string>();

//       while (stack.length) {
//         const [cx, cy] = stack.pop()!;
//         if (cx < 0 || cy < 0 || cx >= width || cy >= ctx.canvas.height) continue;

//         const currentColor = getPixel(cx, cy);
//         if (colorToString(currentColor) === borderColorString && !visited.has(`${cx},${cy}`)) {
//           visited.add(`${cx},${cy}`);
//           setPixel(cx, cy, fillColor);

//           stack.push([cx + 1, cy]);
//           stack.push([cx - 1, cy]);
//           stack.push([cx, cy + 1]);
//           stack.push([cx, cy - 1]);
//         }
//       }
//     };

//     // Find the boundary and fill inside it with black
//     for (let y = 0; y < ctx.canvas.height; y++) {
//       for (let x = 0; x < ctx.canvas.width; x++) {
//         const color = getPixel(x, y);
//         if (colorToString(color) === borderColorString) {
//           floodFill(x, y);
//         }
//       }
//     }

//     // Set the remaining areas outside the annotation to white
//     for (let i = 0; i < data.length; i += 4) {
//       if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
//         data[i] = 0;     // Red
//         data[i + 1] = 0; // Green
//         data[i + 2] = 0; // Blue
//         data[i + 3] = 255; // Alpha
//       } else {
//         data[i] = 255;   // Red
//         data[i + 1] = 255; // Green
//         data[i + 2] = 255; // Blue
//         data[i + 3] = 255; // Alpha
//       }
//     }

//     ctx.putImageData(imageData, 0, 0);
//   };

//   const handleExportImage = () => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         // Create a new canvas for the mask
//         const maskCanvas = document.createElement('canvas');
//         maskCanvas.width = canvas.width;
//         maskCanvas.height = canvas.height;
//         const maskCtx = maskCanvas.getContext('2d');
//         if (maskCtx) {
//           // Fill the mask canvas with white color
//           maskCtx.fillStyle = 'white';
//           maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

//           // Draw the original canvas content onto the mask canvas
//           maskCtx.drawImage(canvas, 0, 0);

//           // Fill inside the border with black
//           fillInsideBorder(maskCtx);

//           // Export the mask image
//           const maskDataUrl = maskCanvas.toDataURL('image/png');
//           console.log('Masked Image:', maskDataUrl);
//           // Show the masked image
//           const img = new Image();
//           img.src = maskDataUrl;
//           img.onload = () => {
//             document.body.appendChild(img);
//           };
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     if (canvasRef.current && uploadedImage) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//         ctx.drawImage(uploadedImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
//       }
//     }
//   }, [uploadedImage]);

//   return (
//     <div className="App">
//       <h1>Image Masking with Canvas</h1>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       <div className="canvas-container">
//         <canvas
//           ref={canvasRef}
//           width={500}
//           height={500}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//         />
//       </div>
//       <button onClick={handleExportImage}>Export Mask</button>
//     </div>
//   );
// };

// export default App;




// import React, { useRef, useState, useEffect } from 'react';

// const App: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const img = new Image();
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           img.src = e.target.result as string;
//           img.onload = () => setUploadedImage(img);
//         }
//       };
//       reader.readAsDataURL(event.target.files[0]);
//     }
//   };

//   const startDrawing = (e: React.MouseEvent) => {
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.strokeStyle = 'white'; // Use white for drawing the annotations
//         ctx.lineWidth = 4;
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//       }
//     }
//   };

//   const draw = (e: React.MouseEvent) => {
//     if (!isDrawing) return;
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//       }
//     }
//   };

//   const stopDrawing = () => {
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.closePath();
//       }
//     }
//     setIsDrawing(false);
//   };

//   const fillInsideBorder = (ctx: CanvasRenderingContext2D, threshold: number) => {
//     const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
//     const data = imageData.data;
//     const width = ctx.canvas.width;

//     const borderColor: [number, number, number, number] = [255, 255, 255, 255]; // white
//     const fillColor: [number, number, number, number] = [0, 0, 0, 255]; // black

//     const getPixel = (x: number, y: number): [number, number, number, number] => {
//       const index = (y * width + x) * 4;
//       return [data[index], data[index + 1], data[index + 2], data[index + 3]] as [number, number, number, number];
//     };

//     const setPixel = (x: number, y: number, color: [number, number, number, number]) => {
//       const index = (y * width + x) * 4;
//       data[index] = color[0];
//       data[index + 1] = color[1];
//       data[index + 2] = color[2];
//       data[index + 3] = color[3];
//     };

//     const colorToString = (color: [number, number, number, number]) =>
//       `${color[0]},${color[1]},${color[2]},${color[3]}`;

//     const borderColorString = colorToString(borderColor);
//     const fillColorString = colorToString(fillColor);

//     const floodFill = (x: number, y: number) => {
//       const stack: [number, number][] = [[x, y]];
//       const visited = new Set<string>();

//       while (stack.length) {
//         const [cx, cy] = stack.pop()!;
//         if (cx < 0 || cy < 0 || cx >= width || cy >= ctx.canvas.height) continue;

//         const currentColor = getPixel(cx, cy);
//         if (colorToString(currentColor) === borderColorString && !visited.has(`${cx},${cy}`)) {
//           visited.add(`${cx},${cy}`);
//           setPixel(cx, cy, fillColor);

//           stack.push([cx + 1, cy]);
//           stack.push([cx - 1, cy]);
//           stack.push([cx, cy + 1]);
//           stack.push([cx, cy - 1]);
//         }
//       }
//     };

//     // Find the boundary and fill inside it with black
//     for (let y = 0; y < ctx.canvas.height; y++) {
//       for (let x = 0; x < ctx.canvas.width; x++) {
//         const color = getPixel(x, y);
//         if (colorToString(color) === borderColorString) {
//           floodFill(x, y);
//         }
//       }
//     }

//     // Set the remaining areas outside the annotation to white
//     for (let i = 0; i < data.length; i += 4) {
//       if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
//         data[i] = 0;     // Red
//         data[i + 1] = 0; // Green
//         data[i + 2] = 0; // Blue
//         data[i + 3] = 255; // Alpha
//       } else {
//         data[i] = 255;   // Red
//         data[i + 1] = 255; // Green
//         data[i + 2] = 255; // Blue
//         data[i + 3] = 255; // Alpha
//       }
//     }

//     ctx.putImageData(imageData, 0, 0);
//   };

//   const handleExportImage = () => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         // Create a new canvas for the mask
//         const maskCanvas = document.createElement('canvas');
//         maskCanvas.width = canvas.width;
//         maskCanvas.height = canvas.height;
//         const maskCtx = maskCanvas.getContext('2d');
//         if (maskCtx) {
//           // Draw a white background on the mask canvas
//           maskCtx.fillStyle = 'white';
//           maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

//           // Draw the original canvas content onto the mask canvas
//           maskCtx.drawImage(canvas, 0, 0);

//           // Fill inside the border with black
//           fillInsideBorder(maskCtx, 0); // Call the fillInsideBorder function here

          
  
//           // Get the drawn path (annotation) from the original canvas
//           // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//           // const drawnPoints = [];
//           // for (let i = 0; i < imageData.data.length; i += 4) {
//           //   if (imageData.data[i + 3] > 0) { // Check if the pixel is not transparent
//           //     const x = (i / 4) % canvas.width;
//           //     const y = Math.floor((i / 4) / canvas.width);
//           //     drawnPoints.push({ x, y });
//           //   }
//           // }
  
//           // Draw the drawn path (annotation) in black on the mask canvas
//           // maskCtx.fillStyle = 'black';
//           // maskCtx.beginPath();
//           // maskCtx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
//           // for (const point of drawnPoints) {
//           //   maskCtx.lineTo(point.x, point.y);
//           // }
//           // maskCtx.fill();
  
//           // Export the mask image
//           const maskDataUrl = maskCanvas.toDataURL('image/png');
//           console.log('Masked Image:', maskDataUrl);
//           // Show the masked image
//           const img = new Image();
//           img.src = maskDataUrl;
//           img.onload = () => {
//             document.body.appendChild(img);
//           };
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     if (canvasRef.current && uploadedImage) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//         ctx.drawImage(uploadedImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
//       }
//     }
//   }, [uploadedImage]);

//   return (
//     <div className="App">
//       <h1>Image Masking with Canvas</h1>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       <div className="canvas-container">
//         <canvas
//           ref={canvasRef}
//           width={500}
//           height={500}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//         />
//       </div>
//       <button onClick={handleExportImage}>Export Mask</button>
//     </div>
//   );
// };

// export default App;



// import React, { useRef, useState, useEffect } from 'react';

// const App: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const img = new Image();
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           img.src = e.target.result as string;
//           img.onload = () => setUploadedImage(img);
//         }
//       };
//       reader.readAsDataURL(event.target.files[0]);
//     }
//   };

//   const startDrawing = (e: React.MouseEvent) => {
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.strokeStyle = 'white'; // Use white for drawing the annotations
//         ctx.lineWidth = 4;
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//       }
//     }
//   };

//   const draw = (e: React.MouseEvent) => {
//     if (!isDrawing) return;
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//       }
//     }
//   };

//   const stopDrawing = () => {
//     if (canvasRef.current) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.closePath();
//       }
//     }
//     setIsDrawing(false);
//   };

//   const fillInsideBorder = (ctx: CanvasRenderingContext2D) => {
//     const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
//     const data = imageData.data;
//     const width = ctx.canvas.width;

//     const borderColor: [number, number, number, number] = [255, 255, 255, 255]; // white
//     const fillColor: [number, number, number, number] = [0, 0, 0, 255]; // black

//     const getPixel = (x: number, y: number): [number, number, number, number] => {
//       const index = (y * width + x) * 4;
//       return [data[index], data[index + 1], data[index + 2], data[index + 3]] as [number, number, number, number];
//     };

//     const setPixel = (x: number, y: number, color: [number, number, number, number]) => {
//       const index = (y * width + x) * 4;
//       data[index] = color[0];
//       data[index + 1] = color[1];
//       data[index + 2] = color[2];
//       data[index + 3] = color[3];
//     };

//     const colorToString = (color: [number, number, number, number]) =>
//       `${color[0]},${color[1]},${color[2]},${color[3]}`;

//     const borderColorString = colorToString(borderColor);
//     const fillColorString = colorToString(fillColor);

//     const floodFill = (x: number, y: number) => {
//       const stack: [number, number][] = [[x, y]];
//       const visited = new Set<string>();

//       while (stack.length) {
//         const [cx, cy] = stack.pop()!;
//         if (cx < 0 || cy < 0 || cx >= width || cy >= ctx.canvas.height) continue;

//         const currentColor = getPixel(cx, cy);
//         if (colorToString(currentColor) === borderColorString && !visited.has(`${cx},${cy}`)) {
//           visited.add(`${cx},${cy}`);
//           setPixel(cx, cy, fillColor);

//           stack.push([cx + 1, cy]);
//           stack.push([cx - 1, cy]);
//           stack.push([cx, cy + 1]);
//           stack.push([cx, cy - 1]);
//         }
//       }
//       // ctx.putImageData(imageData, 0, 0);
//     };

//     // Find the boundary and fill inside it with black
//     for (let y = 0; y < ctx.canvas.height; y++) {
//       for (let x = 0; x < ctx.canvas.width; x++) {
//         const color = getPixel(x, y);
//         if (colorToString(color) === borderColorString) {
//           floodFill(x, y);
//         }
//       }
//     }

//     // Set the remaining areas outside the annotation to white
//     for (let i = 0; i < data.length; i += 4) {
//       if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
//         data[i] = 0;     // Red
//         data[i + 1] = 0; // Green
//         data[i + 2] = 0; // Blue
//         data[i + 3] = 255; // Alpha
//       } else {
//         data[i] = 255;   // Red
//         data[i + 1] = 255; // Green
//         data[i + 2] = 255; // Blue
//         data[i + 3] = 255; // Alpha
//       }
//     }

//     ctx.putImageData(imageData, 0, 0);
//   };

//   const handleExportImage = () => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         // Create a new canvas for the mask
//         const maskCanvas = document.createElement('canvas');
//         maskCanvas.width = canvas.width;
//         maskCanvas.height = canvas.height;
//         const maskCtx = maskCanvas.getContext('2d');
//         if (maskCtx) {
//           // Draw a white background on the mask canvas
//           maskCtx.fillStyle = 'white';
//           maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

//           // Draw the original canvas content onto the mask canvas
//           maskCtx.drawImage(canvas, 0, 0);

//           // Fill inside the border with black
//           fillInsideBorder(maskCtx); // Call the fillInsideBorder function here
  
//           // Export the mask image
//           const maskDataUrl = maskCanvas.toDataURL('image/png');
//           console.log('Masked Image:', maskDataUrl);
//           // Show the masked image
//           const img = new Image();
//           img.src = maskDataUrl;
//           img.onload = () => {
//             document.body.appendChild(img);
//           };
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     if (canvasRef.current && uploadedImage) {
//       const ctx = canvasRef.current.getContext('2d');
//       if (ctx) {
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//         ctx.drawImage(uploadedImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
//       }
//     }
//   }, [uploadedImage]);

//   return (
//     <div className="App">
//       <h1>Image Masking with Canvas</h1>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       <div className="canvas-container">
//         <canvas
//           ref={canvasRef}
//           width={500}
//           height={500}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseLeave={stopDrawing}
//         />
//       </div>
//       <button onClick={handleExportImage}>Export Mask</button>
//     </div>
//   );
// };

// export default App;


import React, { useRef, useState, useEffect } from 'react';
import './canvas.css'; 

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
          img.onload = () => setUploadedImage(img);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.closePath();
      }
    }
  };

  const floodFill = (x: number, y: number, fillColor: [number, number, number, number], whiteColor: [number, number, number, number]) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = imageData.data;
    const width = imageData.width;

    const targetColor: [number, number, number, number] = [0, 0, 0, 255]; // Black
    const fillColorArray: [number, number, number, number] = fillColor; // Color to fill

    const getColor = (x: number, y: number): [number, number, number, number] => {
      const index = (y * width + x) * 4;
      return [data[index], data[index + 1], data[index + 2], data[index + 3]] as [number, number, number, number];
    };

    const setColor = (x: number, y: number, color: [number, number, number, number]) => {
      const index = (y * width + x) * 4;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = color[3];
    };

    const colorMatch = (color1: [number, number, number, number], color2: [number, number, number, number]) => {
      return color1.every((value, index) => value === color2[index]);
    };

    const stack: [number, number][] = [[x, y]];
    const visited = new Set<string>();

    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      if (cx < 0 || cy < 0 || cx >= width || cy >= canvasRef.current.height) continue;
      if (visited.has(`${cx},${cy}`)) continue;

      const color = getColor(cx, cy);
      if (colorMatch(color, targetColor)) {
        setColor(cx, cy, fillColorArray);
        visited.add(`${cx},${cy}`);
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleExportImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const maskCtx = maskCanvas.getContext('2d');
        if (maskCtx) {
          // Draw the uploaded image onto the mask canvas
          if (uploadedImage) {
            maskCtx.drawImage(uploadedImage, 0, 0, maskCanvas.width, maskCanvas.height);
          }

          // Draw the annotations onto the mask canvas
          maskCtx.drawImage(canvas, 0, 0);

          // Get the image data
          const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
          const data = imageData.data;

          // Create a mask by coloring inside the drawn annotations
          const whiteColor: [number, number, number, number] = [255, 255, 255, 255];
          const blackColor: [number, number, number, number] = [0, 0, 0, 255];

          for (let i = 0; i < data.length; i += 4) {
            const isWhite = data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255;
            if (isWhite) {
              data[i] = 0;     // Red
              data[i + 1] = 0; // Green
              data[i + 2] = 0; // Blue
              data[i + 3] = 255; // Alpha
            } else {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
              data[i + 3] = 255;
            }
          }

          maskCtx.putImageData(imageData, 0, 0);

          // Flood fill black in the annotated region
          floodFill(0, 0, blackColor, whiteColor );

          // Export the mask image
          const maskDataUrl = maskCanvas.toDataURL('image/png');
          console.log('Masked Image:', maskDataUrl);
          const img = new Image();
          img.src = maskDataUrl;
          img.onload = () => {
            document.body.appendChild(img);
          };
        }
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current && uploadedImage) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(uploadedImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    // document.body.style.backgroundColor = '#f0f0f0';
    // return () => {
    //   document.body.style.backgroundColor = '';
    // };
  }, [uploadedImage]);

  return (
    <div className="App">
      <h1>Image Masking with Canvas</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      <button onClick={handleExportImage}>Export Mask</button>
    </div>
  );
};

export default App;
