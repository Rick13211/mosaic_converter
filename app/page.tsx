'use client'

import renderGrid from "@/utils/renderGrid";
import { useRef, useState } from "react";

interface MosaicData {
  grid: string[][];
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const refImage = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [data, setData] = useState<MosaicData | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to convert image.");
      }

      const result = await res.json();

      if (result) {
        setData(result); 
        renderGrid(result.grid,canvasRef.current!)
        if (refImage.current) refImage.current.value = "";
        setImage(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = ()=>{
    const canvas = canvasRef.current
    if (!canvas)return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'mosaic.png'
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 font-sans dark:bg-zinc-950 dark:text-zinc-100">
      
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Mosaic Converter
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Upload an image to convert it into an emoji mosaic.
          </p>
        </div>

        {/* Upload Form */}
        <form 
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col items-center gap-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800"
        >
          <input 
            ref={refImage} 
            type="file" 
            accept="image/*" 
            disabled={isLoading}
            onChange={(e) => setImage(e.target.files?.[0] || null)} 
            className="block w-full text-sm text-zinc-500 dark:text-zinc-400
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-indigo-900/30 dark:file:text-indigo-400
              cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button 
            type="submit" 
            disabled={!image || isLoading}
            className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            {isLoading ? "Converting..." : "Convert to Mosaic"}
          </button>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}
        </form>

        {data &&(<>
          <canvas ref={canvasRef} width={80*12} height={60*12} className="border border-zinc-200 dark:border-zinc-800"/>
          <button onClick={handleDownload} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900">Download</button>
        </>)}
      </div>

    </div>
  );
}
