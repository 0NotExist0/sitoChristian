const MaterialGenerator = {
    // Risoluzione massima per le mappe generate (per evitare lag su immagini in 4K)
    MAX_SIZE: 512,

    /**
     * Calcola tutte le mappe PBR partendo da un'immagine sorgente.
     * Restituisce una Promise con un oggetto contenente gli URL in Base64 delle mappe.
     */
    async generateFromDiffuse(imageSrc) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageSrc;

            img.onload = () => {
                // Calcola le dimensioni proporzionali
                let width = img.width;
                let height = img.height;
                if (width > this.MAX_SIZE || height > this.MAX_SIZE) {
                    const ratio = Math.min(this.MAX_SIZE / width, this.MAX_SIZE / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                // Setup del canvas base
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0, width, height);

                const sourceData = ctx.getImageData(0, 0, width, height);

                // Genera le singole mappe
                const heightMap = this.createHeightMap(sourceData, width, height);
                const normalMap = this.createNormalMap(heightMap, width, height);
                const roughnessMap = this.createRoughnessMap(heightMap, width, height);
                const aoMap = this.createAOMap(heightMap, width, height);

                resolve({
                    albedo: imageSrc,
                    normal: this.imageDataToBase64(normalMap, width, height),
                    roughness: this.imageDataToBase64(roughnessMap, width, height),
                    ao: this.imageDataToBase64(aoMap, width, height),
                    height: this.imageDataToBase64(heightMap, width, height)
                });
            };

            img.onerror = (err) => reject("Errore caricamento texture: " + err);
        });
    },

    createHeightMap(sourceData, w, h) {
        const out = new ImageData(w, h);
        for (let i = 0; i < sourceData.data.length; i += 4) {
            const r = sourceData.data[i];
            const g = sourceData.data[i + 1];
            const b = sourceData.data[i + 2];
            // Luminosità (Grayscale)
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            
            out.data[i] = lum;     // R
            out.data[i+1] = lum;   // G
            out.data[i+2] = lum;   // B
            out.data[i+3] = 255;   // Alpha
        }
        return out;
    },

    createNormalMap(heightData, w, h) {
        const out = new ImageData(w, h);
        const strength = 2.0; // Intensità della normal map

        const getPixel = (x, y) => {
            x = Math.max(0, Math.min(w - 1, x));
            y = Math.max(0, Math.min(h - 1, y));
            return heightData.data[(y * w + x) * 4]; // Usa il canale R della heightmap
        };

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                // Filtro Sobel (Approssimazione per Gx e Gy)
                const tl = getPixel(x - 1, y - 1);
                const tc = getPixel(x, y - 1);
                const tr = getPixel(x + 1, y - 1);
                const l  = getPixel(x - 1, y);
                const r  = getPixel(x + 1, y);
                const bl = getPixel(x - 1, y + 1);
                const bc = getPixel(x, y + 1);
                const br = getPixel(x + 1, y + 1);

                const dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
                const dY = (bl + 2.0 * bc + br) - (tl + 2.0 * tc + tr);
                const dZ = 255.0 / strength;

                // Normalizzazione del vettore (dX, dY, dZ)
                const length = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
                const nX = dX / length;
                const nY = dY / length;
                const nZ = dZ / length;

                // Mappa il range da [-1, 1] a [0, 255]
                const idx = (y * w + x) * 4;
                out.data[idx] = Math.floor((nX + 1.0) * 127.5);     // R (X)
                out.data[idx+1] = Math.floor((nY + 1.0) * 127.5);   // G (Y)
                out.data[idx+2] = Math.floor(nZ * 255.0);           // B (Z)
                out.data[idx+3] = 255;                              // Alpha
            }
        }
        return out;
    },

    createRoughnessMap(heightData, w, h) {
        const out = new ImageData(w, h);
        for (let i = 0; i < heightData.data.length; i += 4) {
            const lum = heightData.data[i];
            // Invertiamo: le parti più chiare (rilievi) spesso sono più usurate/ruvide, o viceversa.
            // Puoi aggiustare il contrasto per rendere il legno/metallo più credibile.
            const roughness = 255 - lum; // Semplice inversione
            
            out.data[i] = roughness;
            out.data[i+1] = roughness;
            out.data[i+2] = roughness;
            out.data[i+3] = 255;
        }
        return out;
    },

    createAOMap(heightData, w, h) {
        const out = new ImageData(w, h);
        for (let i = 0; i < heightData.data.length; i += 4) {
            let lum = heightData.data[i];
            // L'AO scurisce le cavità (parti scure della heightmap). Aumentiamo il contrasto.
            lum = lum < 128 ? lum * 0.5 : lum; 
            
            out.data[i] = lum;
            out.data[i+1] = lum;
            out.data[i+2] = lum;
            out.data[i+3] = 255;
        }
        return out;
    },

    imageDataToBase64(imgData, w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.8);
    }
};