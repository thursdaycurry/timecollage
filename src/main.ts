import { CollageMaker } from "./classes/CollageMaker";
import "./style.css";

const uploadedImages: HTMLElement | null =
  document.getElementById("uploadedImages");
const downloadButton: HTMLElement | null =
  document.getElementById("downloadPdf");

if (uploadedImages && downloadButton) {
  downloadButton.addEventListener("click", async (): Promise<void> => {
    const images = uploadedImages.files;

    const collage = new CollageMaker("a1", images);
    await collage.drawCollageOutline().drawCollageGrid().drawCollageImages();

    const pdf = collage.getPDF();

    pdf.save("collage.pdf");
  });
}
