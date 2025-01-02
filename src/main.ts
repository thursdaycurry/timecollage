import { CollageMaker } from "./classes/CollageMaker";
import "./style.css";

const uploadedImages = document.getElementById(
  "uploadedImages"
) as HTMLInputElement | null;

const previewContainer = document.getElementById(
  "previewContainer"
) as HTMLElement | null;

const downloadButton: HTMLElement | null =
  document.getElementById("downloadPdf");

const timeTextElement: HTMLElement | null = document.getElementById(
  "timeText"
) as HTMLElement | null;

const timeTextList = [
  // "Time", // English (USA, UK, Canada, Australia, etc.)
  "Tiempo", // Spanish (Argentina, Mexico, Spain)
  "Tempo", // Italian (Italy)
  "Temps", // French (France, Canada)
  "Zeit", // German (Germany)
  "Время", // Russian (Russia)
  "وقت", // Arabic (Saudi Arabia)
  "时间", // Chinese (China)
  "時", // Japanese (Japan)
  "시간", // Korean (South Korea)
  "Tempo", // Portuguese (Brazil)
  "समय", // Hindi (India)
  "زمان", // Persian (Iran)
  "Zaman", // Turkish (Turkey)
  "เวลา", // Thai (Thailand)
  "Ora", // Indonesian (Indonesia)
  "Waqt", // Urdu (Pakistan)
  "Óra", // Hungarian (Hungary)
  "Vrijeme", // Croatian (Croatia)
  "Hora", // Czech (Czech Republic)
];

const container = document.querySelector(".container") as HTMLElement;

// uploaded images event listener
if (uploadedImages) {
  uploadedImages.addEventListener("change", (e) => {
    const files = uploadedImages.files;

    if (files && previewContainer) {
      previewContainer.innerHTML = "";

      let totalWidth = 24;
      let loadedCount = 0;

      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target?.result as string;
          img.alt = file.name;
          // img.style.width = "8px";
          img.style.height = "8px";
          previewContainer.appendChild(img);

          if (totalWidth <= 450) totalWidth += 3;
          loadedCount++;

          if (timeTextElement) {
            timeTextElement.textContent = `${
              timeTextList[loadedCount % timeTextList.length]
            }`;
          }

          previewContainer.style.width = `${totalWidth}px`;

          if (loadedCount === files.length && timeTextElement) {
            timeTextElement.textContent = "Time";
          }
        };
        reader.readAsDataURL(file);
      }
    }
  });
}

// download button event listener
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
