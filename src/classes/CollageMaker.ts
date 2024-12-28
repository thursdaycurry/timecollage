import { getFileFormat } from "../helpers/fileHandler";

export class CollageMaker {
  sizeFormat: string;
  images: File[];
  doc: any;
  totalImgHorizontal: number;
  totalImgVertical: number;
  canvasWidth: number;
  canvasHeight: number;
  unitWidth: number;
  margin: number;
  imageSideLength: number;

  collageWidth: number;
  collageHeight: number;

  constructor(sizeFormat: string, images: any[]) {
    this.sizeFormat = sizeFormat;
    this.images = images;
    this.doc = new window.jspdf.jsPDF({
      unit: "mm",
      format: getFileFormat(sizeFormat),
    });
    this.canvasWidth = getFileFormat(sizeFormat)[0];
    this.canvasHeight = getFileFormat(sizeFormat)[1];

    this.totalImgHorizontal = 9;
    this.totalImgVertical = 13;
    this.unitWidth = this.canvasWidth / (this.totalImgHorizontal + 1); // add 1 for margin on each side

    this.margin = this.unitWidth / 2;
    this.imageSideLength = this.unitWidth;

    this.collageWidth = this.imageSideLength * this.totalImgHorizontal;
    this.collageHeight = this.imageSideLength * this.totalImgVertical;
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
}
