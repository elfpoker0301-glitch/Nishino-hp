// アップロード画像のヘルパー関数
function getDisplayImageUrl(imagePath) {
    if (!imagePath) return 'images/sample/work1.jpg';
    
    // アップロード画像の場合はbase64データを使用
    if (imagePath.startsWith('images/uploads/')) {
        const fileName = imagePath.split('/').pop();
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
        const uploadData = uploadedFiles[fileName];
        if (uploadData && uploadData.dataUrl) {
            return uploadData.dataUrl;
        }
        // フォールバック
        return 'images/sample/work1.jpg';
    }
    
    return imagePath;
}