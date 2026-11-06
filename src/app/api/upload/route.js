import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { getTodayString } from '@/lib/constants';
import { createWorker } from 'tesseract.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!file || !userId) {
      return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: '仅支持 JPG/PNG/GIF/WebP' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '文件不能超过10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const today = getTodayString();
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', today);
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || '.jpg';
    const filename = `${userId}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // OCR 识别
    let recognized = 0;
    try {
      const worker = await createWorker('chi_sim+eng', 1, {
        logger: () => {}, // 静默
      });
      const { data: { text } } = await worker.recognize(filePath);
      await worker.terminate();

      // 解析学习时长: 查找 "XX小时" 或 "XX分钟" 或 "XXh" 或纯数字
      const hourMatch = text.match(/(\d+\.?\d*)\s*(?:小时|h|时)/i);
      const minMatch = text.match(/(\d+\.?\d*)\s*(?:分钟|min)/i);
      const allNums = text.match(/(\d+\.\d+)/g);

      if (hourMatch) {
        recognized = parseFloat(hourMatch[1]);
      } else if (minMatch) {
        recognized = parseFloat(minMatch[1]) / 60;
      } else if (allNums) {
        // 取最大的合理数值 (学习时长一般不超过15h)
        const valid = allNums.map(Number).filter(n => n > 0 && n < 24);
        if (valid.length > 0) {
          recognized = Math.max(...valid);
        }
      }
      // 保留一位小数
      recognized = Math.round(recognized * 10) / 10;
    } catch (ocrErr) {
      console.log('OCR skipped:', ocrErr.message);
    }

    const screenshot = await prisma.screenshot.create({
      data: {
        userId: parseInt(userId),
        date: today,
        filename: `/uploads/${today}/${filename}`,
        recognized,
      },
    });

    return NextResponse.json({
      success: true,
      screenshot: {
        id: screenshot.id,
        filename: screenshot.filename,
        recognized: screenshot.recognized,
      },
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
