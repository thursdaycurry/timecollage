import "./style.css";

const uploadedImages: HTMLElement | null =
  document.getElementById("uploadedImages");
const downloadButton: HTMLElement | null =
  document.getElementById("downloadPdf");

class CollageMaker {
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

const getFileFormat = (size: string) => {
  const formatDict = {
    a1: [594, 841],
  };

  return formatDict[size];
};

if (uploadedImages && downloadButton) {
  downloadButton.addEventListener("click", async (): Promise<void> => {
    const images = uploadedImages.files;

    /**
     * 1 unit width = total witdh / 10 units(9 for 9 images, 1 for margin)
     * -> margin will be 0.5 unit width on each side
     */

    // add 1 for margin on each side

    const collage = new CollageMaker("a1", images);

    const result = collage.drawCollageOutline();

    console.log(result);

    result.doc.save();
    // doc.text("hello world", 10, 10);
    // doc.save("a4.pdf");
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
