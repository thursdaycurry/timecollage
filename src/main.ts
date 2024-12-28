import { CollageMaker } from "./classes/CollageMaker";
import "./style.css";

const uploadedImages: HTMLElement | null =
  document.getElementById("uploadedImages");
const downloadButton: HTMLElement | null =
  document.getElementById("downloadPdf");

if (uploadedImages && downloadButton) {
  downloadButton.addEventListener("click", async (): Promise<void> => {
    const images = uploadedImages.files;

    /**
     * 1 unit width = total witdh / 10 units(9 for 9 images, 1 for margin)
     * -> margin will be 0.5 unit width on each side
     */
    const collage = new CollageMaker("a1", images);
    const result = collage.drawCollageOutline();
    console.log(result);

    result.doc.save();
  });
}
