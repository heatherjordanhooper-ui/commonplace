'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Plus } from 'lucide-react';

type Item = {
  id: number;
  url: string;
  isUploaded?: boolean;
};

type Lookbook = {
  week: string;
  date: string;
  title: string;
  subtitle: string;
  editorsNote: string;
  palette: string[];
  textures: string;
  mood: string;
  shapes: string;
  imageIds: number[];
  cover: string;
};

export default function Home() {
  const [view, setView] = useState('moodboard');
  const [items, setItems] = useState<Item[]>([]);
  const [archives, setArchives] = useState<Lookbook[]>([]);
  const [showLookbook, setShowLookbook] = useState(false);
  const [currentLookbook, setCurrentLookbook] = useState<Lookbook | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('commonplace-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems([
        { id: 1, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600' },
        { id: 2, url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600' },
        { id: 3, url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600' },
        { id: 4, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
      ]);
    }

    const savedArchives = localStorage.getItem('commonplace-archives');
    if (savedArchives) setArchives(JSON.parse(savedArchives));

    const savedLookbook = localStorage.getItem('commonplace-current-lookbook');
    if (savedLookbook) setCurrentLookbook(JSON.parse(savedLookbook));
  }, []);

  const saveItems = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem('commonplace-items', JSON.stringify(newItems));
  };

  const saveLookbook = (lookbook: Lookbook) => {
    setCurrentLookbook(lookbook);
    localStorage.setItem('commonplace-current-lookbook', JSON.stringify(lookbook));
  };

  const saveArchives = (newArchives: Lookbook[]) => {
    setArchives(newArchives);
    localStorage.setItem('commonplace-archives', JSON.stringify(newArchives));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        saveItems([...items, { 
          id: Date.now() + Math.random(), 
          url: event.target?.result as string,
          isUploaded: true
        }]);
      };
      reader.readAsDataURL(file);
    });
    setView('moodboard');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          saveItems([...items, { 
            id: Date.now() + Math.random(), 
            url: event.target?.result as string,
            isUploaded: true
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
    setView('moodboard');
  };

  const handleAddItem = () => {
    if (urlInput) {
      saveItems([...items, { id: Date.now(), url: urlInput }]);
      setUrlInput('');
      setView('moodboard');
    }
  };

  const handleRemoveItem = (id: number) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const generateLookbook = async () => {
    if (items.length === 0) {
      alert('Add some images first');
      return;
    }

    setIsGenerating(true);

    try {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const formatDate = (d: Date) => {
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return `${months[d.getMonth()]} ${d.getDate()}`;
      };

      const weekRange = `${formatDate(weekStart)}–${formatDate(weekEnd)}`;
      const imagesToAnalyze = items.slice(0, 6);
      
      const imageContent = imagesToAnalyze.map(item => {
        if (item.isUploaded) {
          const matches = item.url.match(/^data:([^;]+);base64,(.+)$/);
          const mediaType = matches ? matches[1] : 'image/jpeg';
          const base64Data = matches ? matches[2] : item.url.split(',')[1];
          
          return {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data
            }
          };
        } else {
          return {
            type: 'image',
            source: {
              type: 'url',
              url: item.url
            }
          };
        }
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: imageContent
        })
      });

      const data = await response.json();
      
      if (data.error || !data.content) {
        console.error('API returned:', JSON.stringify(data, null, 2));
        throw new Error(data.error || 'Invalid response from API');
      }

      const text = data.content.find((c: any) => c.type === 'text')?.text || '';
      
      if (!text) {
        throw new Error('No text content in response');
      }

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(cleanText);

      const lookbook: Lookbook = {
        week: weekRange,
        date: now.toISOString(),
        title: analysis.title,
        subtitle: analysis.subtitle,
        editorsNote: analysis.editorsNote,
        palette: analysis.palette,
        textures: analysis.textures,
        mood: analysis.mood,
        shapes: analysis.shapes,
        imageIds: imagesToAnalyze.map(img => img.id),
        cover: imagesToAnalyze[0]?.url || ''
      };

      saveLookbook(lookbook);
      setIsGenerating(false);
      setShowLookbook(true);
    } catch (error: any) {
      console.error('Full error:', error);
      setIsGenerating(false);
      alert(`Failed: ${error.message}`);
    }
  };

  const archiveCurrentLookbook = async () => {
    if (!currentLookbook) return;
    saveArchives([currentLookbook, ...archives]);
    saveItems([]);
    saveLookbook(null as any);
    setShowLookbook(false);
    setView('moodboard');
  };

  const MoodboardView = () => (
    <div className="flex-1 overflow-y-auto bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-16 py-16">
        
        <div className="flex items-center justify-between mb-16">
          <button 
            onClick={generateLookbook}
            disabled={isGenerating || items.length === 0}
            className="text-[8px] uppercase tracking-[0.25em] px-5 py-1.5 bg-black text-white hover:bg-gray-800 disabled:opacity-20 transition-all"
          >
            {isGenerating ? 'generating...' : 'generate lookbook'}
          </button>
          
          <button 
            onClick={() => setView('add')}
            className="text-[8px] uppercase tracking-[0.25em] px-5 py-1.5 border border-gray-300 hover:border-black transition-all"
          >
            add images
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] mb-6">collection empty</p>
            <button 
              onClick={() => setView('add')}
              className="text-[8px] uppercase tracking-[0.25em] px-5 py-1.5 bg-black text-white"
            >
              add images
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-6 gap-x-8 gap-y-12">
              {items.map((item, idx) => (
                <div 
                  key={item.id}
                  className="relative group"
                >
                  <div className="text-center mb-2">
                    <span className="text-[9px] text-gray-400 font-serif">{idx + 1}</span>
                  </div>
                  
                  <div className="aspect-square overflow-hidden bg-white border border-gray-200">
                    <img 
                      src={item.url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-6 right-0 bg-white border border-gray-300 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={8} />
                  </button>
                </div>
              ))}
            </div>

            {currentLookbook && (
              <div className="mt-20 pt-12 border-t border-gray-200 max-w-4xl">
                <div className="grid grid-cols-4 gap-8 text-[9px]">
                  <div>
                    <span className="text-gray-400 block mb-2 uppercase tracking-[0.25em] font-serif">palette</span>
                    <div className="flex gap-1.5 mt-3">
                      {currentLookbook.palette.map(c => (
                        <div key={c} className="w-4 h-4 border border-gray-200" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2 uppercase tracking-[0.25em] font-serif">textures</span>
                    <p className="text-gray-700 text-[8px] mt-3">{currentLookbook.textures}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2 uppercase tracking-[0.25em] font-serif">mood</span>
                    <p className="text-gray-700 text-[8px] mt-3">{currentLookbook.mood}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2 uppercase tracking-[0.25em] font-serif">shapes</span>
                    <p className="text-gray-700 text-[8px] mt-3">{currentLookbook.shapes}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const ArchiveView = () => (
    <div className="flex-1 overflow-y-auto bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-16 py-16">
        {archives.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-serif">no archives</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-12">
            {archives.map((archive, idx) => (
              <div 
                key={idx}
                className="cursor-pointer group"
                onClick={() => {
                  setCurrentLookbook(archive);
                  setShowLookbook(true);
                }}
              >
                <div className="aspect-[3/4] overflow-hidden bg-white border border-gray-200 mb-3">
                  <img 
                    src={archive.cover} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" 
                  />
                </div>
                <h3 className="text-[9px] mb-1 font-serif">{archive.title}</h3>
                <p className="text-[8px] text-gray-400 font-serif">{archive.week}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const AddItemView = () => (
    <div className="flex-1 overflow-y-auto bg-[#FAFAF8]">
      <div className="max-w-[500px] mx-auto px-16 py-16">
        <div className="space-y-8">
          <div>
            <label className="block text-[8px] text-gray-400 mb-3 uppercase tracking-[0.25em] font-serif">image url</label>
            <input 
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-200 bg-white text-[10px] focus:outline-none focus:border-gray-400"
            />
          </div>

          <button 
            onClick={handleAddItem}
            disabled={!urlInput}
            className="w-full bg-black text-white py-2 text-[8px] uppercase tracking-[0.25em] hover:bg-gray-800 disabled:opacity-20 font-serif"
          >
            add
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[8px]">
              <span className="px-3 bg-[#FAFAF8] text-gray-400 uppercase tracking-[0.25em] font-serif">or</span>
            </div>
          </div>

          <label 
            className={`block border border-dashed bg-white p-16 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="text-[8px] text-gray-400 uppercase tracking-[0.25em] font-serif">
              {isDragging ? 'drop here' : 'drag & drop or click'}
            </p>
            <input 
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const LookbookModal = () => {
    if (!currentLookbook) return null;

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-screen flex items-center justify-center">
            <img 
              src={currentLookbook.cover} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
            <div className="relative z-10 text-white text-center px-8">
              <p className="text-[7px] mb-4 tracking-[0.3em] uppercase opacity-70 font-serif">
                {currentLookbook.week}
              </p>
              <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-tight font-serif">{currentLookbook.title}</h1>
              <p className="text-xs tracking-wide opacity-80 font-serif">{currentLookbook.subtitle}</p>
            </div>
          </div>

          <div className="px-16 py-20 max-w-2xl mx-auto">
            <h2 className="text-[8px] tracking-[0.3em] text-gray-400 mb-6 uppercase font-serif">editor's note</h2>
            <p className="text-sm leading-relaxed text-gray-700 font-light font-serif">
              {currentLookbook.editorsNote}
            </p>
          </div>

          <div className="space-y-0">
            {currentLookbook.imageIds.map((imgId) => {
              const item = items.find(i => i.id === imgId);
              return item ? (
                <div key={imgId}>
                  <img src={item.url} alt="" className="w-full h-screen object-cover" />
                </div>
              ) : null;
            })}
          </div>

          <div className="h-20" />

          <div className="fixed top-6 right-6 flex gap-3">
            {!archives.includes(currentLookbook) && (
              <button 
                onClick={archiveCurrentLookbook}
                className="text-white bg-black/20 backdrop-blur-sm px-4 py-2 text-[7px] uppercase tracking-[0.25em] hover:bg-black/40 font-serif"
              >
                archive
              </button>
            )}
            <button 
              onClick={() => setShowLookbook(false)}
              className="text-white bg-black/20 backdrop-blur-sm px-4 py-2 text-[7px] uppercase tracking-[0.25em] hover:bg-black/40 font-serif"
            >
              close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-16 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xs tracking-tight font-light font-serif">commonplace</h1>
          </div>
          
          <nav className="flex gap-12 text-[8px] uppercase tracking-[0.25em] font-serif">
            <button 
              onClick={() => setView('moodboard')}
              className={`pb-1 border-b transition-colors ${view === 'moodboard' ? 'border-black' : 'border-transparent text-gray-400'}`}
            >
              view
            </button>
            <button 
              onClick={() => setView('archive')}
              className={`pb-1 border-b transition-colors ${view === 'archive' ? 'border-black' : 'border-transparent text-gray-400'}`}
            >
              archive {archives.length > 0 && `(${archives.length})`}
            </button>
          </nav>
        </div>
      </header>

      {view === 'moodboard' && <MoodboardView />}
      {view === 'archive' && <ArchiveView />}
      {view === 'add' && <AddItemView />}

      {showLookbook && <LookbookModal />}
    </div>
  );
}