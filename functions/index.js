const functions = require('firebase-functions');
const gc = require('@google-cloud/storage');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs-extra');
const os = require('os');

sharp.cache(false);
const tmpdir = os.tmpdir;
const join = path.join, dirname = path.dirname;

const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.createImageData = functions.storage.object().onFinalize(async (object) => {
    const gcs = admin.storage();
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const bucketDir = dirname(filePath);
    const contentType = object.contentType;
    if (!contentType.startsWith('image/')) {
        console.log('Not an image');
        return null;
    }
    const fileName = path.basename(filePath);
    if (fileName.includes('1920w') || fileName.includes('640w')) {
        console.log('Already a thumbnail');
        return null;
    }
    const fileNameStripped = fileName.split('.').shift();
    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, 'source.jpg');

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath).download({
      destination: tmpFilePath
    });

    // 3. Resize the images and define an array of upload promises
    const sizes = [640, 1920];
    let heights = {
        640:null,
        1920:null,
    };

    const uploadPromises = sizes.map(async size => {
      const thumbName = `${fileNameStripped}_${size}w.jpg`;
      const thumbPath = join(workingDir, thumbName);

      // Resize source image
      await sharp(tmpFilePath)
        .resize(size, null)
        .toFile(thumbPath)
        .then((info) => heights[size] = info.height);

      // Upload to GCS
      return bucket.upload(thumbPath, {
        destination: join(bucketDir, thumbName)
      });
    });

    // 4. Run the upload operations
    await Promise.all(uploadPromises);

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    await fs.remove(workingDir)
            .then(() => {
                return fs.remove(tmpFilePath);
            })
            .then(() => {
                return fs.remove(bucketDir);
            });


    let addImage = admin.firestore().collection('images').add({
        name: fileName,
        full: `https://firebasestorage.googleapis.com/v0/b/jeffsugg-portfolio.appspot.com/o/gallery%2F${fileNameStripped}_1920w.jpg?alt=media`,
        thumb: `https://firebasestorage.googleapis.com/v0/b/jeffsugg-portfolio.appspot.com/o/gallery%2F${fileNameStripped}_640w.jpg?alt=media`,
        fullHeight: heights[1920],
        thumbHeight: heights[640],
    }).then(ref => {
        console.log('Added image with ID: ', ref.id);
    });

    return addImage.then(res => {
        console.log('Add: ', res);
    });

});