import React, { useCallback, useState } from 'react';
import { Upload, Image, X, FileWarning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export default function ImageDropzone({ onFileSelect, selectedFile, onClear }) {
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState('');

    const validateFile = (file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Only JPG, PNG, and WEBP files are supported');
            return false;
        }
        if (file.size > MAX_SIZE) {
            setError('File size must be under 20MB');
            return false;
        }
        setError('');
        return true;
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
        }
    };

    if (selectedFile) {
        return (
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
                <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full max-h-[400px] object-contain bg-muted/30"
                />
                <button
                    onClick={onClear}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                        <Image className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center ${dragOver
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    }`}
            >
                <input
                    id="file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileInput}
                    className="hidden"
                />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={dragOver ? 'drag' : 'idle'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-primary/20' : 'bg-muted'
                            }`}>
                            <Upload className={`h-7 w-7 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                            <p className="font-semibold mb-1">
                                {dragOver ? 'Drop your image here' : 'Drag & drop your image'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                or click to browse · JPG, PNG, WEBP up to 20MB
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center gap-2 text-sm text-destructive"
                    >
                        <FileWarning className="h-4 w-4" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}