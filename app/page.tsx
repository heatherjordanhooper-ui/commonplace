'use client';

import React, { useState } from 'react';
import { Grid3x3, BookOpen, Plus, X } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState('moodboard');
  const [items, setItems] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', color: '#8B7355' },
    { id: 2, url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600', color: '#E8DCC4' },
    { id: 3, url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600', color: '#6B8E23' },
    { id: 4, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', color: '#4682B4' },
    { id: 5, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600', color: '#2F4F4F' },
    { id: 6, url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600', color: '#DEB887' },
  ]);
  const [showLookbook, setShowLookbook] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleAddItem = () => {
    if (urlInput) {
      setItems([...items, { 
        id: Date.now(), 
        url: urlInput,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      }]);
      setUrlInput('');
      setView('moodboard');
    }
  };

  const MoodboardView = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-16 py-20">
        
        <div className="grid grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <div 
              key={item.id}
              className={`relative overflow-hidden transition-opacity duration-700 hover:opacity-70 cursor-pointer ${
                idx === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              style={{ aspectRatio: '1/1' }}
            >
              <img 
                src={item.url} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-12 text-xs tracking-wide">
            <div>
              <span className="text-gray-400 block mb-3 uppercase">palette</span>
              <div className="flex gap-2">
                {['#8B7355', '#E8DCC4', '#6B8E23', '#4682B4', '#2F4F4F'].map(c => (
                  <div key={c} className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-400 block mb-3 uppercase">textures</span>
              <p className="text-gray-700">organic, mineral, soft</p>
            </div>
            <div>
              <span className="text-gray-400 block mb-3 uppercase">mood</span>
              <p className="text-gray-700">quiet, contemplative</p>
            </div>
            <div>
              <span className="text-gray-400 block mb-3 uppercase">shapes</span>
              <p className="text-gray-700">horizons, curves</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ArchiveView = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-16 py-20">
        
        <div className="grid grid-cols-3 gap-8">
          {[
            { week: 'jan 20–26', theme: 'winter light', cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
            { week: 'jan 13–19', theme: 'earthen tones', cover: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600' },
            { week: 'jan 06–12', theme: 'quiet spaces', cover: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600' },
          ].map((week, idx) => (
            <div 
              key={idx}
              className="cursor-pointer group"
              onClick={() => setShowLookbook(true)}
            >
              <div className="relative overflow-hidden mb-4 aspect-[3/4]">
                <img src={week.cover} alt="" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity duration-700" />
              </div>
              <h3 className="text-sm mb-1">{week.theme}</h3>
              <p className="text-xs text-gray-400">{week.week}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AddItemView = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-16 py-20">
        
        <div className="space-y-8">
          <div>
            <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wide">image url</label>
            <input 
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div className="border border-dashed border-gray-300 p-20 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">or drop an image</p>
          </div>

          <button 
            onClick={handleAddItem}
            disabled={!urlInput}
            className="w-full bg-black text-white py-4 text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            save
          </button>
        </div>
      </div>
    </div>
  );

  const LookbookModal = () => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        
        <div className="relative h-screen flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          <div className="relative z-10 text-white text-center px-8">
            <p className="text-xs mb-6 tracking-widest uppercase opacity-70">issue 03 · jan 20–26</p>
            <h1 className="text-7xl font-light mb-6 tracking-tight">winter light</h1>
            <p className="text-sm tracking-wide opacity-80">where the cold air meets warm remembering</p>
          </div>
        </div>

        <div className="px-20 py-24 max-w-3xl mx-auto">
          <h2 className="text-xs tracking-widest text-gray-400 mb-6 uppercase">editor's note</h2>
          <p className="text-lg leading-loose text-gray-700 font-light">
            this week, your attention drifted toward edges—where land meets sky, where shadow touches light. 
            there's a recurring pull toward vastness held within stillness. the palette stayed cold but somehow 
            comforting, like winter light through a window at 4pm. what you saved wasn't escape but a kind of 
            witnessing. the images don't ask for anything. they just exist, quietly.
          </p>
        </div>

        <div className="space-y-0">
          {items.slice(0, 4).map((item) => (
            <div key={item.id}>
              <img src={item.url} alt="" className="w-full h-screen object-cover" />
            </div>
          ))}
        </div>

        <div className="h-32" />

        <button 
          onClick={() => setShowLookbook(false)}
          className="fixed top-8 right-8 text-white bg-black/20 backdrop-blur-sm px-6 py-3 text-xs uppercase tracking-wider hover:bg-black/40 transition-colors"
        >
          close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-20 py-12">
          <div className="flex items-center justify-between mb-16">
            <h1 className="text-xl tracking-tight font-light">commonplace</h1>
          </div>
          
          <div className="flex items-center justify-between">
            <nav className="flex gap-16 text-xs uppercase tracking-widest">
              <button 
                onClick={() => setView('moodboard')}
                className={`transition-colors ${view === 'moodboard' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                view
              </button>
              <button 
                onClick={() => setView('archive')}
                className={`transition-colors ${view === 'archive' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                archive
              </button>
              <button 
                onClick={() => setView('add')}
                className={`transition-colors ${view === 'add' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                add
              </button>
            </nav>

            <button 
              onClick={() => setShowLookbook(true)}
              className="bg-black text-white px-8 py-3 text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              this week
            </button>
          </div>
        </div>
      </header>

      {view === 'moodboard' && <MoodboardView />}
      {view === 'archive' && <ArchiveView />}
      {view === 'add' && <AddItemView />}

      {showLookbook && <LookbookModal />}
    </div>
  );
}
