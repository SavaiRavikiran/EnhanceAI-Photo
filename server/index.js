import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ─── Static Files ───────────────────────────────────────────────
const uploadsDir = path.join(ROOT, 'public', 'uploads');
const enhancedDir = path.join(ROOT, 'public', 'enhanced');
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(enhancedDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));
app.use('/enhanced', express.static(enhancedDir));

// ─── Multer for file uploads ────────────────────────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        cb(null, allowed.includes(file.mimetype));
    },
});

// ─── Real-ESRGAN AI Super-Resolution (Local, 100% Free) ────
const REALESRGAN_PATH = path.join(__dirname, 'realesrgan', 'realesrgan-ncnn-vulkan');
const REALESRGAN_MODELS = {
    '2x': 'realesrgan-x4plus',  // Use general model for 2x
    '3x': 'realesrgan-x4plus',  // Use general model for 3x  
    '4x': 'realesrgan-x4plus',  // Use general model for 4x
    'general': 'realesrgan-x4plus',
    'anime': 'realesrgan-x4plus-anime'
};

// ─── In-memory stores ───────────────────────────────────────────
let currentUser = {
    id: 'user_1',
    full_name: 'Local User',
    email: 'user@local.dev',
    credits: 50,
    total_enhancements: 0,
    plan: 'free',
    role: 'admin',
    avatar_url: null,
};

const enhancementJobs = [];

// ─── AI Enhancement Functions ───────────────────────────────────

async function realESRGANEnhance(inputPath, modelType = 'general') {
    return new Promise((resolve, reject) => {
        const model = REALESRGAN_MODELS[modelType] || REALESRGAN_MODELS['general'];
        
        // Convert to JPG first for better Real-ESRGAN compatibility
        const jpgPath = inputPath.replace(/\.[^/.]+$/, '-temp.jpg');
        const outputPath = inputPath.replace(/\.[^/.]+$/, '-realesrgan.png');
        
        console.log(`  🤖 Running Real-ESRGAN with model: ${model}`);
        console.log(`  📁 Input: ${inputPath}`);
        console.log(`  📁 JPG temp: ${jpgPath}`);
        console.log(`  📁 Output: ${outputPath}`);
        
        // Convert to JPG first, removing alpha channel
        sharp(inputPath)
            .flatten() // Remove alpha channel
            .jpeg({ quality: 90 })
            .toFile(jpgPath)
            .then(() => {
                const args = [
                    '-i', jpgPath,
                    '-o', outputPath,
                    '-n', model,
                    '-s', '2', // Use 2x scaling for all enhancements to avoid huge files
                    '-f', 'png'
                ];
                
                // Run from realesrgan directory so it can find model files
                const process = spawn(REALESRGAN_PATH, args, { 
                    stdio: 'pipe',
                    cwd: path.dirname(REALESRGAN_PATH)
                });
                
                let stdout = '';
                let stderr = '';
                
                process.stdout.on('data', (data) => {
                    stdout += data.toString();
                });
                
                process.stderr.on('data', (data) => {
                    stderr += data.toString();
                });
                
                process.on('close', (code) => {
                    // Keep temp JPG file for debugging
                    // if (fs.existsSync(jpgPath)) fs.unlinkSync(jpgPath);
                    
                    console.log(`  📊 Real-ESRGAN exit code: ${code}`);
                    console.log(`  📝 stdout: ${stdout.slice(0, 200)}`);
                    if (stderr) console.log(`  ⚠️ stderr: ${stderr.slice(0, 200)}`);
                    
                    if (code === 0 && fs.existsSync(outputPath)) {
                        console.log('  ✅ Real-ESRGAN enhancement completed');
                        try {
                            const buffer = fs.readFileSync(outputPath);
                            fs.unlinkSync(outputPath); // cleanup temp file
                            resolve(buffer);
                        } catch (err) {
                            console.log(`  ❌ Failed to read output: ${err.message}`);
                            reject(err);
                        }
                    } else {
                        const errorMsg = `Real-ESRGAN failed with code ${code}: ${stderr.slice(0, 100)}`;
                        console.log(`  ❌ ${errorMsg}`);
                        reject(new Error(errorMsg));
                    }
                });
                
                process.on('error', (err) => {
                    // Clean up temp JPG file
                    if (fs.existsSync(jpgPath)) fs.unlinkSync(jpgPath);
                    console.log(`  ❌ Real-ESRGAN process error: ${err.message}`);
                    reject(err);
                });
            })
            .catch((err) => {
                console.log(`  ❌ Failed to convert to JPG: ${err.message}`);
                reject(err);
            });
    });
}

async function sharpEnhance(inputPath, enhancementType) {
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;
    let pipeline = sharp(inputPath);

    switch (enhancementType) {
        case 'upscale_2x':
            pipeline = pipeline
                .resize(width * 2, height * 2, { kernel: sharp.kernel.lanczos3 })
                .normalize()
                .sharpen({ sigma: 2.5, m1: 2.0, m2: 1.5 })
                .modulate({ brightness: 1.05, saturation: 1.20 })
                .gamma(1.1);
            break;
        case 'upscale_4x':
            pipeline = pipeline
                .resize(width * 4, height * 4, { kernel: sharp.kernel.lanczos3 })
                .normalize()
                .sharpen({ sigma: 3.0, m1: 2.5, m2: 2.0 })
                .modulate({ brightness: 1.05, saturation: 1.25 })
                .gamma(1.1);
            break;
        default:
            pipeline = pipeline
                .normalize()
                .sharpen({ sigma: 2.5, m1: 2.0, m2: 1.5 })
                .modulate({ brightness: 1.08, saturation: 1.30 })
                .gamma(1.15);
            break;
    }

    return pipeline.png({ quality: 95 }).toBuffer();
}

// ─── API Routes ─────────────────────────────────────────────────

app.get('/api/auth/me', (_req, res) => res.json(currentUser));
app.put('/api/auth/me', (req, res) => {
    currentUser = { ...currentUser, ...req.body };
    res.json(currentUser);
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const file_url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ file_url });
});

// ─── Image Enhancement Endpoint ─────────────────────────────────
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, existing_image_urls } = req.body;

        if (!existing_image_urls?.length) {
            return res.status(400).json({ message: 'No image URL provided' });
        }

        const imageUrl = existing_image_urls[0];
        const promptLower = (prompt || '').toLowerCase();

        // Determine enhancement type and Real-ESRGAN model
        let enhancementType = 'general';
        let realesrganModel = 'general';
        
        if (promptLower.includes('4x')) {
            enhancementType = 'upscale_4x';
            realesrganModel = '4x';
        } else if (promptLower.includes('2x') || promptLower.includes('upscale')) {
            enhancementType = 'upscale_2x';
            realesrganModel = '2x';
        } else if (promptLower.includes('3x')) {
            enhancementType = 'upscale_3x';
            realesrganModel = '3x';
        } else if (promptLower.includes('face') || promptLower.includes('facial')) {
            enhancementType = 'face_restore';
            realesrganModel = 'general';
        } else if (promptLower.includes('denoise') || promptLower.includes('noise')) {
            enhancementType = 'denoise';
            realesrganModel = 'general';
        } else if (promptLower.includes('color') || promptLower.includes('contrast')) {
            enhancementType = 'color_correct';
            realesrganModel = 'general';
        } else if (promptLower.includes('old photo') || promptLower.includes('restore')) {
            enhancementType = 'old_photo_restore';
            realesrganModel = 'general';
        } else if (promptLower.includes('sharpen')) {
            enhancementType = 'sharpen';
            realesrganModel = 'general';
        }

        console.log(`\n🔮 Enhancement request: ${enhancementType}`);
        console.log(`📝 Prompt: ${prompt}`);

        const filename = path.basename(new URL(imageUrl).pathname);
        const imagePath = path.join(uploadsDir, filename);
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Source image not found' });
        }

        const startTime = Date.now();
        let enhancedBuffer = null;

        // Step 1: Try Real-ESRGAN AI super-resolution first
        console.log('🧠 Step 1: Real-ESRGAN AI Super-Resolution...');
        try {
            enhancedBuffer = await realESRGANEnhance(imagePath, realesrganModel);
            console.log(`  📏 AI enhanced buffer size: ${enhancedBuffer.length} bytes`);
            
            // Step 2: Apply minimal Sharp post-processing
            console.log('🎨 Step 2: Minimal Sharp post-processing...');
            const tempPath = path.join(enhancedDir, `temp-${Date.now()}.png`);
            fs.writeFileSync(tempPath, enhancedBuffer);
            
            // Just convert to PNG without heavy processing
            enhancedBuffer = await sharp(tempPath).png({ quality: 95 }).toBuffer();
            
            fs.unlinkSync(tempPath); // clean up temp
        } catch (error) {
            console.log(`  ⚠️  Real-ESRGAN failed: ${error.message}`);
            console.log('  🔄 Using Sharp fallback...');
            enhancedBuffer = await sharpEnhance(imagePath, enhancementType);
        }

        // Save final result
        const enhancedFilename = `enhanced-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
        const enhancedPath = path.join(enhancedDir, enhancedFilename);
        fs.writeFileSync(enhancedPath, enhancedBuffer);

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const enhancedUrl = `http://localhost:${PORT}/enhanced/${enhancedFilename}`;
        console.log(`✅ Done in ${elapsed}s → ${enhancedUrl}\n`);

        res.json({ url: enhancedUrl });
    } catch (error) {
        console.error('❌ Enhancement error:', error.message);
        res.status(500).json({ message: error.message || 'Image enhancement failed' });
    }
});

// Entity CRUD
app.get('/api/entities/:entity', (req, res) => {
    if (req.params.entity === 'EnhancementJob') return res.json(enhancementJobs);
    if (req.params.entity === 'User') return res.json([currentUser]);
    res.json([]);
});

app.post('/api/entities/:entity', (req, res) => {
    if (req.params.entity === 'EnhancementJob') {
        const job = { id: `job_${Date.now()}`, created_date: new Date().toISOString(), ...req.body };
        enhancementJobs.unshift(job);
        return res.json(job);
    }
    res.json(req.body);
});

app.put('/api/entities/:entity/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body });
});

app.get('/api/app/public-settings', (_req, res) => {
    res.json({ appName: 'EnhanceAI', version: '1.0.0' });
});

// ─── Start Server ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 EnhanceAI backend running at http://localhost:${PORT}`);
    console.log(`📁 Uploads: ${uploadsDir}`);
    console.log(`🧠 AI Engine: Real-ESRGAN (local) + Sharp (post-processing)`);
    console.log(`� Cost: 100% FREE - No API keys, no rate limits!\n`);
});
