import { CollageMaker } from "./classes/CollageMaker";
import "./style.css";

const uploadedImages = document.getElementById(
  "uploadedImages"
) as HTMLInputElement | null;

const downloadButton: HTMLElement | null =
  document.getElementById("downloadPdf");

if (uploadedImages && downloadButton) {
  downloadButton.addEventListener("click", async (): Promise<void> => {
    const images: FileList | null = uploadedImages.files;

    if (images && images.length > 0) {
      const imageArray: File[] = Array.from(images);

      const collage = new CollageMaker("a1", imageArray);
      await collage.drawCollageOutline().drawCollageImages();

      await collage.drawCollageGrid(3);

      const pdf = collage.getPDF();

      pdf.save("collage.pdf");
    }
  });
}
