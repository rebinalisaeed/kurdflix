<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// فۆڵدەرە بنەڕەتییەکان
$baseDir = 'assets/';

// ژێر فۆڵدەرەکان
$typeDirs = [
    'image' => 'assets/images/',
    'video' => 'assets/videos/',
    'audio' => 'assets/audio/',
    'subtitle' => 'assets/subtitles/',
    'other' => 'assets/other/'
];

// دروستکردنی فۆڵدەرەکان ئەگەر بوونیان نەبوو
foreach ($typeDirs as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
}

// ژێر فۆڵدەرەکان بۆ وێنە (پۆستەر و سلاید و ...)
if (!file_exists('assets/images/posters/')) mkdir('assets/images/posters/', 0777, true);
if (!file_exists('assets/images/slides/')) mkdir('assets/images/slides/', 0777, true);
if (!file_exists('assets/images/thumbnails/')) mkdir('assets/images/thumbnails/', 0777, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'error' => 'هیچ فایلێک هەڵنەبژێردراوە']);
        exit;
    }
    
    $file = $_FILES['file'];
    $fileType = $_POST['type'] ?? 'other';
    $originalName = pathinfo($file['name'], PATHINFO_FILENAME);
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // دیاریکردنی شوێنی گونجاو بۆ هەڵگرتنی فایل
    $targetDir = $typeDirs['other'];
    
    switch ($fileType) {
        case 'image':
            // بۆ وێنە، دەتوانیت لە ژێر فۆڵدەری images دایبنێیت
            $targetDir = 'assets/images/';
            break;
        case 'video':
            $targetDir = $typeDirs['video'];
            break;
        case 'audio':
            $targetDir = $typeDirs['audio'];
            break;
        case 'subtitle':
            $targetDir = $typeDirs['subtitle'];
            break;
    }
    
    // ناوی تایبەت بۆ فایلەکە دروست بکە
    $newFileName = time() . '_' . uniqid() . '.' . $extension;
    $targetPath = $targetDir . $newFileName;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $baseUrl = (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
        $baseUrl .= str_replace($_SERVER['DOCUMENT_ROOT'], '', $targetPath);
        
        echo json_encode([
            'success' => true,
            'url' => $baseUrl,
            'path' => $targetPath,
            'filename' => $newFileName
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'بارکردنی فایلەکە سەرکەوتوو نەبوو']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
