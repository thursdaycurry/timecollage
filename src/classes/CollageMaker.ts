import jsPDF from "jspdf";
import { getFileFormat, readFileAsDataURL } from "../helpers/fileHandler";

export class CollageMaker {
  sizeFormat: string;
  images: File[];
  doc: any;
  totalImgColumns: number;
  totalImgRows: number;
  canvasWidth: number;
  canvasHeight: number;
  imgSideLength: number;
  margin: number;
  collageWidth: number;
  collageHeight: number;

  constructor(sizeFormat: string, images: any[]) {
    this.sizeFormat = sizeFormat;
    this.images = images;
    this.doc = new jsPDF({
      unit: "mm",
      format: getFileFormat(sizeFormat),
    });
    this.canvasWidth = getFileFormat(sizeFormat)[0];
    this.canvasHeight = getFileFormat(sizeFormat)[1];
    this.totalImgColumns = 9;
    this.totalImgRows = 12;
    this.imgSideLength = this.canvasWidth / (this.totalImgColumns + 1);
    this.margin = this.imgSideLength / 2;

    this.collageWidth = this.imgSideLength * this.totalImgColumns;
    this.collageHeight = this.imgSideLength * this.totalImgRows;
  }

  drawCollageOutline() {
    const x = this.margin;
    const y = this.margin;
    const width = this.collageWidth;
    const height = this.collageHeight;
    this.doc.setLineWidth(1);
    this.doc.rect(x, y, width, height);

    return this;
  }

  async drawCollageImages() {
    const points = this.getAllTopLeftPoints();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas rendering context is not available");

    await this.draw(async ([x, y, idx]) => {
      if (idx >= this.images.length) return;

      const imageFile = this.images[idx];
      const imageUrl = await readFileAsDataURL(imageFile);
      const img = new Image();
      img.src = imageUrl as string;

      new Promise<void>((resolve) => {
        img.onload = () => {
          const imgWidth = img.width;
          const imgHeight = img.height;

          const cropSideLength = Math.min(imgWidth, imgHeight);

          const cropX = (imgWidth - cropSideLength) / 2;
          const cropY = (imgHeight - cropSideLength) / 2;

          canvas.width = this.imgSideLength * 10; // 10 for quality improvement
          canvas.height = this.imgSideLength * 10;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropSideLength,
            cropSideLength,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const imageDataUrl = canvas.toDataURL("image/jpeg");
          this.doc.addImage(
            imageDataUrl,
            "JPEG",
            x,
            y,
            this.imgSideLength,
            this.imgSideLength
          );
          resolve();
        };
      });
    }, points);

    return this;
  }

  async drawCollageGrid(lineWidth = 1) {
    const points = this.getAllTopLeftPoints();

    await this.draw(async ([x, y]) => {
      this.doc.setLineWidth(lineWidth);
      this.doc.rect(x, y, this.imgSideLength, this.imgSideLength);
    }, points);

    return this;
  }

  async draw<T>(fn: (item: T) => void, iter: T[]): Promise<void> {
    for (const a of iter) {
      await fn(a);
    }
  }

  getAllTopLeftPoints(): number[][] {
    const targets = [];
    let idx = 0;
    for (let r = 0; r < this.totalImgColumns; r++) {
      for (let c = 0; c < this.totalImgRows; c++) {
        targets.push([
          +(this.margin + r * this.imgSideLength).toFixed(1),
          +(this.margin + c * this.imgSideLength).toFixed(1),
          idx++,
        ]);
      }
    }
    return targets;
  }

  getPDF() {
    return this.doc;
  }
}
