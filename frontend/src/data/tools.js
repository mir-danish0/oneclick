import {
  FileText, FileImage, FileSpreadsheet, Presentation, Image, Minimize2,
  Binary, Eraser, Merge, Scissors, Archive, RotateCw, Droplets, Unlock,
  Lock, Hash, Globe, CirclePlay, Play, AtSign, Video, MapPin,
  Link, QrCode, Tag, ExternalLink, Type, CaseSensitive, AlignLeft, Volume2,
  FileDown, FileUp, ImageDown
} from 'lucide-react';

export const categories = [
  { id: 'file-converter', name: 'File Converter', emoji: '🗂️', color: '#00d4ff' },
  { id: 'image-converter', name: 'Image Converter', emoji: '🖼️', color: '#a855f7' },
  { id: 'pdf-tools', name: 'PDF Tools', emoji: '📄', color: '#00ff88' },
  { id: 'social-downloader', name: 'Social Downloader', emoji: '⬇️', color: '#f43f5e' },
  { id: 'link-tools', name: 'Link Tools', emoji: '🔗', color: '#f59e0b' },
  { id: 'text-tools', name: 'Text Tools', emoji: '🔤', color: '#06b6d4' },
];

export const tools = [
  // FILE CONVERTER
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert .docx Word documents to PDF format instantly.',
    category: 'file-converter',
    icon: FileText,
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    type: 'file-convert',
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF files.',
    category: 'file-converter',
    icon: Presentation,
    accept: { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] },
    type: 'file-convert',
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF documents.',
    category: 'file-converter',
    icon: FileSpreadsheet,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    type: 'file-convert',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG or PNG images into a PDF document.',
    category: 'file-converter',
    icon: FileImage,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    type: 'file-convert',
    multiple: true,
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF files back to editable Word documents.',
    category: 'file-converter',
    icon: FileDown,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'file-convert',
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PPT',
    description: 'Convert PDF files to PowerPoint presentations.',
    category: 'file-converter',
    icon: FileUp,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'file-convert',
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract tables from PDF into Excel spreadsheets.',
    category: 'file-converter',
    icon: FileSpreadsheet,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'file-convert',
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to JPG/PNG',
    description: 'Convert each PDF page into high-quality images.',
    category: 'file-converter',
    icon: ImageDown,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'file-convert',
  },

  // IMAGE CONVERTER
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert JPG images to PNG format with transparency support.',
    category: 'image-converter',
    icon: Image,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
    type: 'image-convert',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    description: 'Convert PNG images to compressed JPG format.',
    category: 'image-converter',
    icon: Image,
    accept: { 'image/png': ['.png'] },
    type: 'image-convert',
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG/PNG',
    description: 'Convert modern WebP images to JPG or PNG format.',
    category: 'image-converter',
    icon: Image,
    accept: { 'image/webp': ['.webp'] },
    type: 'image-convert',
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG',
    description: 'Convert Apple HEIC photos to universal JPG format.',
    category: 'image-converter',
    icon: Image,
    accept: { 'image/heic': ['.heic'] },
    type: 'image-convert',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images by pixels or percentage instantly.',
    category: 'image-converter',
    icon: Minimize2,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    type: 'image-resize',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images to reduce file size without losing quality.',
    category: 'image-converter',
    icon: Archive,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    type: 'image-compress',
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert any image into a Base64 encoded string.',
    category: 'image-converter',
    icon: Binary,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    type: 'image-base64',
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Remove image backgrounds with AI-powered processing.',
    category: 'image-converter',
    icon: Eraser,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    type: 'placeholder',
  },

  // PDF TOOLS
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document.',
    category: 'pdf-tools',
    icon: Merge,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-merge',
    multiple: true,
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract specific pages from a PDF document.',
    category: 'pdf-tools',
    icon: Scissors,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-split',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality.',
    category: 'pdf-tools',
    icon: Archive,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-compress',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to any orientation.',
    category: 'pdf-tools',
    icon: RotateCw,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-rotate',
  },
  {
    id: 'watermark-pdf',
    name: 'Add Watermark',
    description: 'Add text or image watermarks to your PDF files.',
    category: 'pdf-tools',
    icon: Droplets,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-watermark',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password protection from PDF files.',
    category: 'pdf-tools',
    icon: Unlock,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-unlock',
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Add password protection to your PDF documents.',
    category: 'pdf-tools',
    icon: Lock,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-protect',
  },
  {
    id: 'pdf-page-numbers',
    name: 'PDF Page Numbers',
    description: 'Add page numbers to your PDF documents.',
    category: 'pdf-tools',
    icon: Hash,
    accept: { 'application/pdf': ['.pdf'] },
    type: 'pdf-pagenumber',
  },

  // SOCIAL MEDIA DOWNLOADER
  {
    id: 'facebook-downloader',
    name: 'Facebook Video Downloader',
    description: 'Download videos from Facebook in HD quality.',
    category: 'social-downloader',
    icon: Globe,
    type: 'social-download',
    placeholder: 'https://www.facebook.com/watch?v=...',
  },
  {
    id: 'instagram-downloader',
    name: 'Instagram Downloader',
    description: 'Download Instagram videos, reels, and stories.',
    category: 'social-downloader',
    icon: CirclePlay,
    type: 'social-download',
    placeholder: 'https://www.instagram.com/reel/...',
  },
  {
    id: 'youtube-downloader',
    name: 'YouTube Downloader',
    description: 'Download YouTube videos in multiple qualities.',
    category: 'social-downloader',
    icon: Play,
    type: 'social-download',
    placeholder: 'https://www.youtube.com/watch?v=...',
  },
  {
    id: 'twitter-downloader',
    name: 'Twitter/X Downloader',
    description: 'Download videos from Twitter/X posts.',
    category: 'social-downloader',
    icon: AtSign,
    type: 'social-download',
    placeholder: 'https://twitter.com/user/status/...',
  },
  {
    id: 'tiktok-downloader',
    name: 'TikTok Downloader',
    description: 'Download TikTok videos without watermark.',
    category: 'social-downloader',
    icon: Video,
    type: 'social-download',
    placeholder: 'https://www.tiktok.com/@user/video/...',
  },
  {
    id: 'pinterest-downloader',
    name: 'Pinterest Downloader',
    description: 'Download high-quality images from Pinterest.',
    category: 'social-downloader',
    icon: MapPin,
    type: 'social-download',
    placeholder: 'https://www.pinterest.com/pin/...',
  },

  // LINK TOOLS
  {
    id: 'link-shortener',
    name: 'Link Shortener',
    description: 'Shorten any long URL into a compact link.',
    category: 'link-tools',
    icon: Link,
    type: 'link-shorten',
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Generate downloadable QR codes for any URL or text.',
    category: 'link-tools',
    icon: QrCode,
    type: 'qr-generate',
  },
  {
    id: 'utm-builder',
    name: 'UTM Link Builder',
    description: 'Build UTM-tagged URLs for marketing campaigns.',
    category: 'link-tools',
    icon: Tag,
    type: 'utm-build',
  },
  {
    id: 'link-expander',
    name: 'Link Expander',
    description: 'Reveal the destination of any shortened URL.',
    category: 'link-tools',
    icon: ExternalLink,
    type: 'link-expand',
  },

  // TEXT TOOLS
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs.',
    category: 'text-tools',
    icon: Type,
    type: 'text-counter',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to UPPER, lower, Title, or Sentence case.',
    category: 'text-tools',
    icon: CaseSensitive,
    type: 'text-case',
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs.',
    category: 'text-tools',
    icon: AlignLeft,
    type: 'text-lorem',
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text into natural-sounding audio.',
    category: 'text-tools',
    icon: Volume2,
    type: 'placeholder',
  },
];

export function getToolsByCategory(categoryId) {
  return tools.filter(t => t.category === categoryId);
}

export function getToolById(toolId) {
  return tools.find(t => t.id === toolId);
}

export function getCategoryById(categoryId) {
  return categories.find(c => c.id === categoryId);
}

export function searchTools(query) {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  );
}
