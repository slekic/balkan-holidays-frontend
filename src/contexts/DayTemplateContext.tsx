import React, { createContext, useContext, useEffect, useState } from 'react';
import { DayTemplate } from '../types/cms';
import { BaseEntityContext, BaseProviderProps, getCurrentTimestamp } from './base';
import { mapDayTemplateToSablonDanaRequest, mapSablonDanaToDayTemplate } from '../utils/cms_response_mappers';
import { dataURLtoFile } from '../utils/image_converter';
import { createSablon, deleteSablonApi, getAllSabloni, updateSablonApi, uploadImages } from '../api/cms';

interface DayTemplateContextType extends BaseEntityContext<DayTemplate> {
  dayTemplates: DayTemplate[];
  addDayTemplate: (template: Omit<DayTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDayTemplate: (id: string, updates: Partial<DayTemplate & { backgroundImage?: string; galleryImages?: string[] }>) => Promise<void>;
  deleteDayTemplate: (id: string) => Promise<void>;
}

const DayTemplateContext = createContext<DayTemplateContextType | undefined>(undefined);

export function DayTemplateProvider({ children }: BaseProviderProps) {
  const [dayTemplates, setDayTemplates] = useState<DayTemplate[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllSabloni();
        setDayTemplates(data.items.map(mapSablonDanaToDayTemplate));
      } catch (err) {
        console.error("Failed to load day templates:", err);
      }
    })();
  }, []);

  const addDayTemplate = async (template: Omit<DayTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createSablon(mapDayTemplateToSablonDanaRequest(template));
      const mapped = mapSablonDanaToDayTemplate(created);

      const data: File[] = [];
      const img_types: string[] = [];

      if (template.backgroundImage && template.backgroundImage !== '') {
        data.push(dataURLtoFile(template.backgroundImage, `day-template-logo${mapped.id}`));
        img_types.push('logo');
      }

      if (template.galleryImages && template.galleryImages.length > 0) {
        template.galleryImages.forEach((img, i) => {
          data.push(dataURLtoFile(img, `day-template-image-${mapped.id}-${i}`));
          img_types.push('slika');
        });
      }

      if (data.length > 0) {
        const res = await uploadImages(Number(mapped.id), 'sablon', data, img_types, []);

        mapped.backgroundImage = res.slike
              .filter((s: { tip: string }) => s.tip === "logo")
              .map((s: { putanja: string }) => s.putanja)[0] ?? mapped.backgroundImage;

        if (Array.isArray(res.slike)) {
            mapped.galleryImages = mapped.galleryImages.concat(res.slike
              .filter((s: { tip: string }) => s.tip === "slika")
              .map((s: { putanja: string }) => s.putanja)) || mapped.galleryImages;
          }
      }

      setDayTemplates(prev => [...prev, { ...mapped, createdAt: getCurrentTimestamp(), updatedAt: getCurrentTimestamp() }]);
    } catch (err) {
      console.error("Failed to add day template:", err);
    }
  };

  const updateDayTemplate = async (id: string, updates: Partial<DayTemplate & { backgroundImage?: string; galleryImages?: string[] }>) => {
    try {
      const updated = await updateSablonApi(Number(id), {
        naslov: updates.title,
        opis: updates.description,
        slike: []
      });

      const mapped = mapSablonDanaToDayTemplate(updated);
      const template = dayTemplates.find(t => t.id === id);
      if (!template) throw new Error("Day template not found");

      const data: File[] = [];
      const img_types: string[] = [];
      const pathsToRemove: string[] = [];

      // handle background image
      let logoChanged = false;
      mapped.backgroundImage = template.backgroundImage;
      if (updates.backgroundImage !== template.backgroundImage) {
        if (template.backgroundImage) pathsToRemove.push(template.backgroundImage);
        if (updates.backgroundImage) {
          data.push(dataURLtoFile(updates.backgroundImage, `day-template-logo${id}`));
          img_types.push('logo');
        } else {
          mapped.backgroundImage = undefined;
        }
        logoChanged = true;
      }

      // handle gallery images
      if (updates.galleryImages || template.galleryImages.length > 0) {
        const diff = (!updates.galleryImages || updates.galleryImages.length === 0)
          ? template.galleryImages
          : template.galleryImages.filter(existing => !updates.galleryImages?.includes(existing));
        const keep = (!updates.galleryImages || updates.galleryImages.length === 0)
          ? []
          : template.galleryImages.filter(existing => updates.galleryImages?.includes(existing));

        pathsToRemove.push(...diff);

        const newImages = updates.galleryImages?.filter(img => !template.galleryImages.includes(img)) || [];
        newImages.forEach((img, i) => {
          data.push(dataURLtoFile(img, `day-template-image-${id}-${i}`));
          img_types.push('slika');
        });

        mapped.galleryImages = keep;
      }

      if (data.length || pathsToRemove.length) {
        const res = await uploadImages(Number(id), 'sablon', data, img_types, pathsToRemove);

        mapped.backgroundImage = res.slike
              .filter((s: { tip: string }) => s.tip === "logo")
              .map((s: { putanja: string }) => s.putanja)[0] ?? mapped.backgroundImage;

        if (Array.isArray(res.slike)) {
            mapped.galleryImages = mapped.galleryImages.concat(res.slike
              .filter((s: { tip: string }) => s.tip === "slika")
              .map((s: { putanja: string }) => s.putanja)) || mapped.galleryImages;
          }
      }

      setDayTemplates(prev => prev.map(t => t.id === id ? { ...mapped, updatedAt: getCurrentTimestamp() } : t));
    } catch (err) {
      console.error("Failed to update day template:", err);
    }
  };

  const deleteDayTemplate = async (id: string) => {
    try {
      await deleteSablonApi(Number(id));
      setDayTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete day template:", err);
    }
  };

  return (
    <DayTemplateContext.Provider value={{
      dayTemplates,
      items: dayTemplates,
      addDayTemplate,
      addItem: addDayTemplate,
      updateDayTemplate,
      updateItem: updateDayTemplate,
      deleteDayTemplate,
      deleteItem: deleteDayTemplate
    }}>
      {children}
    </DayTemplateContext.Provider>
  );
}

export function useDayTemplates() {
  const context = useContext(DayTemplateContext);
  if (!context) throw new Error('useDayTemplates must be used within a DayTemplateProvider');
  return context;
}
