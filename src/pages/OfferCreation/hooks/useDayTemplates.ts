// src/hooks/useDayTemplates.ts
import { toast } from "react-toastify";
import { mapDayTemplateToSablonDanaRequest, mapSablonDanaToDayTemplate } from "../../../utils/cms_response_mappers";
import { createSablon, getAllSabloni, uploadMultipleEntitiesImages } from "../../../api/cms";

export const useDayTemplates = (dayTemplates: any[]) => {
  const saveDayTemplate = async (templateData: any) => {
    const newTemplate = {
      title: templateData.title,
      description: templateData.content.description,
      backgroundImage: templateData.content.backgroundImage,
      galleryImages: templateData.content.images,
    };

    if(!newTemplate.backgroundImage || newTemplate.backgroundImage == ""){
      toast.error("Fali pozadinska slika");
      return;
    }
    if(newTemplate.galleryImages.length < 3) {
      toast.error("Morate uneti tri slike");
      return;
    }

    console.log("Saving template:", newTemplate);

    const dayTemp = await createSablon(mapDayTemplateToSablonDanaRequest(newTemplate));

    const entityIds: number[] = [];
    const entityTypes: string[] = [];
    const filesArr: string[] = [];
    const tipoviArr: string[] = [];
    const exsist: string[] = [];
    const exsistIds: number[] = [];

    if (newTemplate.backgroundImage) {
      if (newTemplate.backgroundImage.startsWith("data:")) {
        filesArr.push(newTemplate.backgroundImage);
        tipoviArr.push("logo");
        entityIds.push(dayTemp.id);
        entityTypes.push("sablon");
      } else {
        exsistIds.push(dayTemp.id);
        exsist.push(newTemplate.backgroundImage);
      }
    }

    newTemplate.galleryImages?.forEach((img: string) => {
      if (img && img.startsWith("data:")) {
        filesArr.push(img);
        tipoviArr.push("slika");
        entityIds.push(dayTemp.id);
        entityTypes.push("sablon");
      } else {
        exsistIds.push(dayTemp.id);
        exsist.push(img);
      }
    });

    try{
      const uploadRes = await uploadMultipleEntitiesImages(
        "sablon",
        entityIds,
        entityTypes,
        filesArr,
        tipoviArr,
        exsistIds,
        exsist,
        exsistIds
      );
      console.log("Upload slides images result:", uploadRes);
  } catch(err: any){
    if (err.message.includes("Nepodržani tip")){
        toast.error(err.message)
    }
  }

    toast.success("Šablon sačuvan!");

    const sabloni = await getAllSabloni();
    dayTemplates.length = 0;
    dayTemplates.push(...sabloni.items.map(mapSablonDanaToDayTemplate));
  };

  return { saveDayTemplate };
};
