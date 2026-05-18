<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$uploadDir = 'uploads/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$typeDirs = [
    'image' => 'uploads/images/',
    'video' => 'uploads/videos/',
    'audio' => 'uploads/audio/',
    'subtitle' => 'uploads/subtitles/',
    'other' => 'uploads/other/'
];

foreach ($typeDirs as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'error' => 'هیچ فایلێک هەڵنەبژێردراوە']);
        exit;
    }
    
    $file = $_FILES['file'];
    $fileType = $_POST['type'] ?? 'other';
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    $targetDir = $typeDirs['other'];
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mp3', 'vtt', 'srt'];
    
    switch ($fileType) {
        case 'image':
            $targetDir = $typeDirs['image'];
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
    
    $newFileName = time() . '_' . uniqid() . '.' . $extension;
    $targetPath = $targetDir . $newFileName;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $baseUrl = (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
        $baseUrl .= str_replace($_SERVER['DOCUMENT_ROOT'], '', $targetPath);
        
        echo json_encode([
            'success' => true,
            'url' => $baseUrl,
            'filename' => $newFileName
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'بارکردنی فایلەکە سەرکەوتوو نەبوو']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>